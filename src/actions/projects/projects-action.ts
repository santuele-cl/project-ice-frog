"use server";

import { db } from "@/app/_lib/db";
import { EditProjectSchema, ProjectSchema } from "@/app/_schemas/zod/schema";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { getErrorMessage } from "../action-utils";
import { Prisma, Schedule } from "@prisma/client";
import { auth } from "@/auth";

const ITEMS_PER_PAGE = 15;

export async function deleteProject(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!projectId) return { error: "Project ID missing!" };

    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) return { error: "Project does not exist!" };

    const deletedProject = await db.project.delete({
      where: { id: projectId },
    });

    if (!deletedProject) return { error: "Something went wrong" };

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/archived/projects");

    return {
      success: "Project Deleted successfully!",
      data: { id: deletedProject.id },
    };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function restoreProject(projectId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!projectId) return { error: "Project ID missing!" };

    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) return { error: "Project does not exist!" };

    const archivedProject = await db.project.update({
      where: { id: projectId },
      data: { isArchived: false },
    });
    if (!archivedProject) return { error: "Something went wrong" };

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/archived/projects");

    return {
      success: "Project archived successfully!",
      data: { id: archivedProject.id },
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function editProject({
  projectId,
  data,
}: {
  projectId: string;
  data: z.infer<typeof EditProjectSchema>;
}) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!projectId || !data) return { error: "Missing data" };

    const existingProject = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) return { error: "Project does not exist" };

    const parse = EditProjectSchema.safeParse(data);

    if (!parse.success) return { error: "Parse error" };

    const updatedProject = await db.project.update({
      where: { id: existingProject.id },
      data,
    });

    if (!updatedProject) return { error: "Something went wrong!" };

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${existingProject.id}`);
    revalidatePath(`/dashboard/projects/${existingProject.id}/edit`);

    const projectHeader = `${existingProject.name
      .charAt(0)
      .toUpperCase()}${existingProject.name.slice(1)}`;
    // +
    // existingProject.name.substring(0, 1);
    return {
      success: `${projectHeader} (${existingProject.id}) has successfully been updated.`,
      data: { jobOrderId: existingProject.jobOrder },
    };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function addProject(values: z.infer<typeof ProjectSchema>) {
  try {
    /**
     * Verify that user is authenticated
     * and has the right permission to do this action
     */
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!values) return { error: "Missing data." };

    /**
     * Parse the data passed using zod
     * to check if valid
     */
    const parse = ProjectSchema.safeParse(values);
    if (!parse.success) return { error: "Parse error. Invalid data input!" };
    const { schedules, ...otherFields } = parse.data;

    if (schedules && schedules.length > 0) {
      /**Verify each employee schedule input(s)
       * does not overlap with each other
       * */
      const overlaps: Partial<Schedule>[] = [];

      schedules.forEach((scheduleA, i) => {
        schedules.forEach((scheduleB, j) => {
          if (i !== j) {
            if (
              scheduleA.userId === scheduleB.userId &&
              scheduleA.startDate < scheduleB.endDate &&
              scheduleA.endDate > scheduleB.startDate
            )
              overlaps.push(scheduleA);
          }
        });
      });

      if (overlaps && overlaps.length > 0)
        return {
          error:
            "Input contains schedules that overlap with each other. Each employee's schedule must not overlap with their other schedules",
          overlaps: overlaps,
        };

      /**
       * Verify each employee schedule does not overlap with
       * his or her existing schedule(s) in the database
       * */
      const overlapsFromDB: Partial<Schedule>[] = [];

      await Promise.all(
        schedules.map(async (schedule) => {
          const existingSchedule = await db.schedule.findFirst({
            where: {
              userId: schedule.userId,
              AND: [
                {
                  startDate: { lt: schedule.endDate },
                  endDate: { gt: schedule.startDate },
                },
              ],
            },
          });

          if (existingSchedule) overlapsFromDB.push(schedule);
        })
      )
        .then((results) => {
          return results;
        })
        .catch((e) => console.log(e));

      if (overlapsFromDB && !!overlapsFromDB.length)
        return {
          error:
            "Input contains employee's schedules that overlap with their existing schedules.",
          overlaps: overlapsFromDB,
        };
    }

    const newProject = await db.project.create({
      data: {
        ...otherFields,
        ...(schedules &&
          !!schedules.length && {
            schedules: { createMany: { data: [...schedules] } },
          }),
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: "Schedule(s) added!", data: newProject };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getProjects({
  page = 1,
  name,
  jobOrder,
  location,
  date,
  isCompleted = false,
  employeeId,
}: {
  isCompleted?: boolean;
  page?: number;
  name?: string;
  jobOrder?: string;
  location?: string;
  date?: Date;
  employeeId?: string;
}) {
  noStore();

  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.id !== employeeId && session.user.role !== "ADMIN")
      return { error: "Unauthorized" };

    const query = {
      where: {
        ...(employeeId && {
          schedules: { some: { userId: { equals: employeeId } } },
        }),
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(jobOrder && {
          jobOrder: { contains: jobOrder, mode: "insensitive" },
        }),
        ...(isCompleted && { isCompleted: isCompleted }),
        ...(location && {
          OR: [
            {
              barangay: { contains: location, mode: "insensitive" },
            },
            {
              street: { contains: location, mode: "insensitive" },
            },
            {
              city: { contains: location, mode: "insensitive" },
            },
            {
              building: { contains: location, mode: "insensitive" },
            },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
      ...(page !== 0 && { take: ITEMS_PER_PAGE }),
      ...(page !== 0 && { skip: (Number(page) - 1) * ITEMS_PER_PAGE }),
    } satisfies Prisma.ProjectFindManyArgs;

    const [projects, count] = await db.$transaction([
      db.project.findMany(query),
      db.project.count({ where: query.where }),
    ]);

    return {
      success: "Success",
      data: projects,
      pagination: {
        totalCount: count,
        itemsPerPage: ITEMS_PER_PAGE,
        totalPages: Math.ceil(count / ITEMS_PER_PAGE),
      },
    };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getProjectScheduleGroupByUserId(projectId: string) {
  noStore();
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const projects = await db.schedule.groupBy({
      by: ["userId"],
      where: { projectId, user: { isArchived: false } },
    });

    if (!projects) return { error: "Database error. Fetch unsuccessful!" };

    return { success: "Success!", data: projects };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getProjectById(id: string) {
  noStore();

  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const project = await db.project.findUnique({
      where: { id },
    });
    if (!project) return { error: "Project does not exist!" };
    return { success: "Success!", data: project };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

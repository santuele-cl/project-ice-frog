"use server";

import { db } from "@/app/_lib/db";
import { EditProjectSchema, ProjectSchema } from "@/app/_schemas/zod/schema";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { getErrorMessage } from "../action-utils";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 15;

export async function deleteProject(projectId: string) {
  if (!projectId) return { error: "Project ID missing!" };

  try {
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
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function restoreProject(projectId: string) {
  if (!projectId) return { error: "Project ID missing!" };

  try {
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
  const parse = ProjectSchema.safeParse(values);

  if (!parse.success) return { error: "Parse error. Invalid data input!" };

  const { schedules, ...otherFields } = parse.data;

  try {
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
}: {
  isCompleted?: boolean;
  page?: number;
  name?: string;
  jobOrder?: string;
  location?: string;
  date?: Date;
}) {
  noStore();
  console.log("location query : ", location, " arr: ");
  try {
    const query = {
      where: {
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
    } as Prisma.ProjectFindManyArgs;

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

  const projects = await db.schedule.groupBy({
    by: ["userId"],
    where: { projectId },
  });

  if (!projects) return { error: "Database error. Fetch unsuccessful!" };

  return { success: "Success!", data: projects };
}

export async function getProjectById(id: string) {
  noStore();

  try {
    const project = await db.project.findUnique({
      where: { id },
    });
    if (!project) return { error: "Project does not exist!" };
    return { success: "Success!", data: project };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

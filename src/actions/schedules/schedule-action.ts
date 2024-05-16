"use server";
import { z } from "zod";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/app/_lib/db";
import {
  EditScheduleSchema,
  RefinedMultipleScheduleSchema,
} from "@/app/_schemas/zod/schema";
import { getErrorMessage } from "../action-utils";
import { Prisma, Schedule } from "@prisma/client";
import { auth } from "@/auth";

const ITEMS_PER_PAGE = 1;

export async function getProjectSchedulesForExport({
  name,
  jobOrder,
  location,
  date,
  isCompleted = false,
  projectId,
}: {
  isCompleted?: boolean;
  page?: number;
  name?: string;
  jobOrder?: string;
  location?: string;
  date?: Date;
  projectId?: string;
}) {
  noStore();

  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!projectId) return { error: "Missing ID" };

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
        name: true,
        jobOrder: true,
        schedules: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                profile: {
                  select: {
                    fname: true,
                    mname: true,
                    lname: true,
                  },
                },
              },
            },
            startDate: true,
            endDate: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { user: { profile: { fname: "asc" } } },
        },
      },
    });

    const processedProjectSchedules = project?.schedules.map((schedule) => {
      const {
        user,
        createdAt,
        endDate,
        notes,
        startDate,
        updatedAt,
        id,
        userId,
      } = schedule;

      const processedSchedule = {
        id,
        userId,
        fname: user?.profile?.fname,
        mname: user?.profile?.mname,
        lname: user?.profile?.lname,
        startDate,
        endDate,
        notes,
        createdAt,
        updatedAt,
      };

      return processedSchedule;
    });

    return {
      success: "Success",
      data: {
        name: project?.name,
        jobOrder: project?.jobOrder,
        schedules: processedProjectSchedules,
      },
    };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getSchedulesByUserIdGroupByProject({
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
    if (!session) return { error: "Unauthenticated" };
    if (session.user.id !== employeeId && session.user.role !== "ADMIN")
      return { error: "Unauthorized" };

    if (!employeeId) return { error: "Missing ID" };

    const isExisting = await db.user.findUnique({ where: { id: employeeId } });
    if (!isExisting) return { error: "Employee does not exist." };

    const query = {
      where: {
        userId: employeeId,
      },
      include: { project: true },
      orderBy: { project: { startDate: "desc" } },
      ...(page !== 0 && { take: ITEMS_PER_PAGE }),
      ...(page !== 0 && { skip: (Number(page) - 1) * ITEMS_PER_PAGE }),
    } satisfies Prisma.ScheduleFindManyArgs;

    const [schedules, count] = await db.$transaction([
      db.schedule.findMany(query),
      db.schedule.count({ where: query.where }),
    ]);

    return {
      success: "Success",
      data: schedules,
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

export async function getSchedulesByUserIdAndProjectId({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) {
  noStore();

  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const schedules = await db.schedule.findMany({
      where: { projectId, userId },
      orderBy: { startDate: "asc" },
      include: {
        user: {
          select: {
            profile: {
              select: {
                contactNumber: true,
                fname: true,
                lname: true,
                department: true,
                occupation: true,
              },
            },
          },
        },
      },
    });
    if (!schedules) return { error: "No schedules" };
    return { success: "Success!", data: schedules };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function addMultipleScheduleByProject(
  schedules: z.infer<typeof RefinedMultipleScheduleSchema>
) {
  try {
    /**
     * Verify that user is authenticated
     * and has the right permission to do this action
     */
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!schedules) return { error: "Missing data." };

    /**
     * Parse the data passed using zod
     * to check if valid
     */
    const parse = RefinedMultipleScheduleSchema.safeParse(schedules);

    if (!parse.success) return { error: "Parse error. Invalid data input!" };
    if (!parse.data.schedules || parse.data.schedules.length < 0)
      return { error: "No schedule(2) received" };

    /**Verify each employee schedule input(s)
     * does not overlap with each other
     * */
    const overlaps: Partial<Schedule>[] = [];

    parse.data.schedules.forEach((scheduleA, i) => {
      parse.data.schedules.forEach((scheduleB, j) => {
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
      parse.data.schedules.map(async (schedule) => {
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

    const createdSchedules = await db.schedule.createMany({
      data: parse.data.schedules,
    });

    if (!createdSchedules) {
      return { error: "Database error. Schedules not added!" };
    }

    revalidatePath("/dashboard/schedules");
    revalidatePath("/dashboard/projects");

    return {
      success: "Schedule(s) has successfully been created.",
      data: schedules,
    };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function addMultipleScheduleByEmployeeId(
  employeeId: string,
  data: z.infer<typeof RefinedMultipleScheduleSchema>
) {
  try {
    /**
     * Verify that user is authenticated
     * and has the right permission to call this action
     */
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!data) return { error: "Missing data." };

    /**
     * Verify if the target employee is existing
     */
    const isExisting = await db.user.findUnique({ where: { id: employeeId } });
    if (!isExisting) return { error: "Employee does not exist." };

    const parse = RefinedMultipleScheduleSchema.safeParse(data);
    if (!parse.success) return { error: "Parse error. Invalid data input!" };
    if (!parse.data.schedules || parse.data.schedules.length < 0)
      return { error: "No schedule(2) received" };

    /**Verify each employee schedule input(s)
     * does not overlap with each other
     * */
    const overlaps: Partial<Schedule>[] = [];

    parse.data.schedules.forEach((scheduleA, i) => {
      parse.data.schedules.forEach((scheduleB, j) => {
        if (i !== j) {
          if (
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
      parse.data.schedules.map(async (schedule) => {
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

    /**
     * Schedule(s) creation
     * */
    const createdSchedules = await db.schedule.createMany({
      data: parse.data.schedules,
    });

    if (!createdSchedules) return { error: "Something went wrong" };

    revalidatePath("/dashboard/schedules");

    return { success: "Schedule(s) added!", data: createdSchedules };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getScheduleByEmployeeId(employeeId: string) {
  noStore();
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const isExisting = await db.user.findUnique({ where: { id: employeeId } });

    if (!isExisting) return { error: "Employee does not exist." };

    const schedules = await db.schedule.findMany({
      where: {
        userId: employeeId,
      },
      orderBy: { startDate: "desc" },
      include: { project: true },
    });

    if (!schedules) return { error: "Something went wrong" };

    return { success: "Schedules fetch successul!", data: schedules };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getScheduleById(id: string) {
  noStore();
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!id) return { error: "Missing ID" };

    const existingSchedule = await db.schedule.findUnique({ where: { id } });

    if (!existingSchedule) return { error: "Schedule does not exist." };

    return { success: "Schedule fetch successul!", data: existingSchedule };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getSchedulesByDate(
  employeeId: string,
  startDate: Date,
  endDate: Date
) {
  noStore();

  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const schedules = await db.schedule.findMany({
      where: {
        userId: employeeId,
        startDate: { gte: startDate },
        endDate: { lte: endDate },
      },
      include: { project: true },
    });

    if (!schedules) return { error: "Something went wrong" };

    // if (schedules.length < 1) return { error: "Empty" };

    return { success: "Schedules fetch successul!", data: schedules };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function editSchedule({
  scheduleId,
  data,
}: {
  scheduleId: string;
  data: z.infer<typeof EditScheduleSchema>;
}) {
  try {
    /**
     * Verify that user is authenticated
     * and has the right permission to call this action
     */
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    /**
     * Verify that the "to edit schedule" is existing
     */
    const schedule = await db.schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) return { error: "Schedule does not exist!" };

    /**
     * Parse the data passed using zod
     * to check if valid
     */
    const parse = EditScheduleSchema.safeParse(data);
    if (!parse.success) return { error: "Parse error. Invalid data" };
    const parsedDate = parse.data;

    /**
     * Verify each updated schedule does not overlap with
     * his or her existing schedule(s)
     * */
    const overlap = await db.schedule.findFirst({
      where: {
        id: { not: schedule.id },
        userId: parsedDate.userId,
        AND: [
          {
            startDate: { lt: parsedDate.endDate },
            endDate: { gt: parsedDate.startDate },
          },
        ],
      },
    });

    if (overlap) return { error: "Schedule overlap" };

    /**
     * Update schedule
     * */
    const updatedSchedule = await db.schedule.update({
      where: { id: scheduleId },
      data: parsedDate,
    });

    if (!updatedSchedule) return { error: "Something went wrong" };

    revalidatePath(`/dashboard/employees/${updatedSchedule.userId}`);

    return { success: "Success!", data: updatedSchedule };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteSchedule(scheduleId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!scheduleId) return { error: "Missing schedule ID" };

    const schedule = await db.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) return { error: "Schedule does not exist!" };

    const deletedSchedule = await db.schedule.delete({
      where: { id: scheduleId },
    });

    if (!deletedSchedule) return { error: "Something went wrong" };

    revalidatePath(`/dashboard/projects/${deletedSchedule.projectId}`);

    return { success: "Success!", data: deletedSchedule };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

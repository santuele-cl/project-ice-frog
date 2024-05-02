"use server";
import { z } from "zod";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { db } from "@/app/_lib/db";
import { EditScheduleSchema, SchedulesSchema } from "@/app/_schemas/zod/schema";
import { getErrorMessage } from "../action-utils";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

const ITEMS_PER_PAGE = 1;

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
    if (!session) return { error: "Unauthorized" };
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
    if (!session) return { error: "Unauthorized" };
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
  schedules: z.infer<typeof SchedulesSchema>
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const parse = SchedulesSchema.safeParse(schedules);

    if (!parse.success) return { error: "Parse error. Invalid data input!" };

    const createdSchedules = await db.schedule.createMany({
      data: parse.data.schedules,
    });

    if (!createdSchedules) {
      return { error: "Database error. Schedules not added!" };
    }

    revalidatePath("/dashboard/schedules");
    return { success: "Schedule(s) added!", data: schedules };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function addMultipleScheduleByEmployeeId(
  employeeId: string,
  schedules: z.infer<typeof SchedulesSchema>
) {
  const session = await auth();

  if (!session) return { error: "Unauthorized" };

  if (session.user.role !== "ADMIN") return { error: "Unauthorized" };
  const isExisting = await db.user.findUnique({ where: { id: employeeId } });

  if (!isExisting) return { error: "Employee does not exist." };

  const parse = SchedulesSchema.safeParse(schedules);

  if (!parse.success) return { error: "Parse error. Invalid data input!" };

  const overlap = await Promise.all(
    parse.data.schedules.map(async (schedule) => {
      const existingSchedules = await db.schedule.findFirst({
        where: {
          userId: employeeId,
          AND: [
            {
              startDate: { lt: schedule.endDate },
              endDate: { gt: schedule.startDate },
            },
          ],
        },
      });
      return existingSchedules;
    })
  )
    .then((results) => {
      return results;
    })
    .catch((e) => console.log(e));

  if (
    overlap &&
    !!overlap.length &&
    overlap.some((item) => {
      return !!item;
    })
  )
    return { error: "Schedule overlap. Schedules not saved.", overlap };

  try {
    // TODO: loop thru schedules then use create instead of create many
    const createdSchedules = await db.schedule.createMany({
      data: parse.data.schedules,
    });

    if (!createdSchedules) return { error: "Something went wrong" };

    revalidatePath("/dashboard/schedules");

    return { success: "Schedule(s) added!", data: schedules };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getScheduleByEmployeeId(employeeId: string) {
  noStore();
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
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
    if (!session) return { error: "Unauthorized" };
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
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const schedules = await db.schedule.findMany({
      where: {
        userId: employeeId,
        startDate: { gte: startDate },
        endDate: { lt: endDate },
      },
      include: { project: true },
    });

    if (!schedules) return { error: "Something went wrong" };

    if (schedules.length < 1) return { error: "Empty" };

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
    const session = await auth();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const schedule = await db.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) return { error: "Schedule does not exist!" };

    const parse = EditScheduleSchema.safeParse(data);

    if (!parse.success) return { error: "Parse error. Invalid data" };

    const overlap = await db.schedule.findFirst({
      where: {
        AND: [
          {
            id: { not: scheduleId },
            startDate: { lt: data.endDate },
            endDate: { gt: data.startDate },
          },
        ],
      },
    });

    if (overlap) return { error: "Schedule overlap" };

    const updatedSchedule = await db.schedule.update({
      where: { id: scheduleId },
      data,
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
    if (!session) return { error: "Unauthorized" };
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

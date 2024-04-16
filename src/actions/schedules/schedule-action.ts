"use server";

import { z } from "zod";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { db } from "@/app/_lib/db";
import { SchedulesSchema } from "@/app/_schemas/zod/schema";
import { getErrorMessage } from "../action-utils";

export async function getSchedulesByUserIdAndProjectId({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) {
  noStore();

  try {
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
  const parse = SchedulesSchema.safeParse(schedules);

  if (!parse.success) return { error: "Parse error. Invalid data input!" };

  try {
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
  const isExisting = await db.user.findUnique({ where: { id: employeeId } });

  if (!isExisting) return { error: "Employee does not exist." };

  const parse = SchedulesSchema.safeParse(schedules);

  if (!parse.success) return { error: "Parse error. Invalid data input!" };

  const overlap = parse.data.schedules.filter(async (schedule) => {
    try {
      const existingSchedules = await db.schedule.findMany({
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

      if (existingSchedules && existingSchedules.length > 0) return true;
      else return false;
    } catch (error: unknown) {
      return true;
    }
  });

  if (overlap && overlap.length > 0)
    return { error: "Schedule overlap. Schedules not saved.", overlap };

  try {
    const createdSchedules = await db.schedule.createMany({
      data: parse.data.schedules,
    });
    if (!createdSchedules) {
      return { error: "Something went wrong" };
    }
    revalidatePath("/dashboard/schedules");
    return { success: "Schedule(s) added!", data: schedules };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getScheduleByEmployeeId(employeeId: string) {
  noStore();

  const isExisting = await db.user.findUnique({ where: { id: employeeId } });

  if (!isExisting) return { error: "Employee does not exist." };

  try {
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

export async function getSchedulesByDate(
  employeeId: string,
  startDate: Date,
  endDate: Date
) {
  noStore();

  try {
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

"use server";

import { db } from "@/app/_lib/db";
import { ScheduleSchema, SchedulesSchema } from "@/app/_schemas/zod/schema";
import shadows from "@mui/material/styles/shadows";
import { Schedule } from "@prisma/client";
import dayjs from "dayjs";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { z } from "zod";
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
  // const isExisting = await db.user.findUnique({ where: { id: employeeId } });

  // if (!isExisting) return { error: "Employee does not exist." };

  // const parse = SchedulesSchema.safeParse(schedules);

  // if (!parse.success) return { error: "Parse error. Invalid data input!" };

  // // const check = await db.schedule.
  console.log(schedules);
  const overlap: Schedule[] = [];

  const check = schedules.schedules.forEach(async (schedule) => {
    try {
      const isScheduleExisting = await db.schedule.findFirst({
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
      console.log("isScheduleExisting", isScheduleExisting);
      if (isScheduleExisting) overlap.push(isScheduleExisting);
    } catch (error: unknown) {
      return { error: getErrorMessage(error) };
    }
  });

  if (overlap.length)
    return { error: "Schedule overlap. Schedules not saved.", overlap };

  return { success: "asdf", overlap, schedules };
  // const createdSchedules = await db.schedule.createMany({
  //   data: parse.data.schedules,
  // });

  // if (!createdSchedules) {
  //   return { error: "Database error. Schedules not added!" };
  // }

  // revalidatePath("/dashboard/schedules");
  // return { success: "Schedule(s) added!", data: schedules };
}

export async function getScheduleByEmployeeId(employeeId: string) {
  noStore();

  const isExisting = await db.user.findUnique({ where: { id: employeeId } });

  if (!isExisting) return { error: "Employee does not exist." };

  const schedules = await db.schedule.findMany({
    where: {
      userId: employeeId,
    },
    orderBy: { startDate: "desc" },
    include: { project: true },
  });

  if (!schedules) {
    return { error: "Database error. Schedules fetch unsuccessful!" };
  }

  // if (schedules.length < 1) {
  //   return { error: "Empty" };
  // }

  return { success: "Schedules fetch successul!", data: schedules };
}

export async function getSchedulesByDate(
  employeeId: string,
  startDate: Date,
  endDate: Date
) {
  noStore();

  console.log({
    startDate,
    endDate,
  });
  const schedules = await db.schedule.findMany({
    where: {
      userId: employeeId,
      startDate: { gte: startDate },
      endDate: { lt: endDate },
    },
    include: { project: true },
  });

  if (!schedules) {
    const error = "Database error. Schedules fetch unsuccessful!";
    console.log(error);
    return { error: error };
  }

  if (schedules.length < 1) {
    return { error: "Empty" };
  }
  return { success: "Schedules fetch successul!", data: schedules };
}

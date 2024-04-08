"use server";

import { db } from "@/app/_lib/db";
import { ScheduleSchema, SchedulesSchema } from "@/app/_schemas/zod/schema";
import shadows from "@mui/material/styles/shadows";
import { Schedule } from "@prisma/client";
import dayjs from "dayjs";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { z } from "zod";

export async function addMultipleScheduleByEmployeeId(
  employeeId: string,
  schedules: z.infer<typeof SchedulesSchema>
) {
  const isExisting = await db.user.findUnique({ where: { id: employeeId } });

  if (!isExisting) return { error: "Employee does not exist." };

  const parse = SchedulesSchema.safeParse(schedules);

  if (!parse.success) return { error: "Parse error. Invalid data input!" };

  const schedulesWithUserId = parse.data.projects.map((proj) => ({
    ...proj,
    userId: employeeId,
  }));

  const createdSchedules = await db.schedule.createMany({
    data: [...schedulesWithUserId],
  });

  if (!createdSchedules) {
    return { error: "Database error. Schedules not added!" };
  }

  revalidatePath("/dashboard/schedules");
  return { success: "Schedule(s) added!", data: schedules };
}

export async function getScheduleByEmployeeId(employeeId: string) {
  noStore();

  const isExisting = await db.user.findUnique({ where: { id: employeeId } });

  if (!isExisting) return { error: "Employee does not exist." };

  const schedules = await db.schedule.findMany({
    where: {
      userId: employeeId,
    },
    orderBy: { createdAt: "desc" },
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

"use server";

import { db } from "@/app/_lib/db";
import shadows from "@mui/material/styles/shadows";
import dayjs from "dayjs";
import { unstable_noStore as noStore } from "next/cache";

export async function getScheduleByEmployeeId(employeeId: string) {
  noStore();

  const schedules = await db.schedule.findMany({
    where: {
      userId: employeeId,
    },
    include: { project: true },
  });

  if (!schedules) {
    return { error: "Database error. Schedules fetch unsuccessful!" };
  }

  if (schedules.length < 1) {
    return { error: "Empty" };
  }

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

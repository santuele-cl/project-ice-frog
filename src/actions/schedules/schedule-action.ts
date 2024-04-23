"use server";

import { z } from "zod";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { db } from "@/app/_lib/db";
import { SchedulesSchema } from "@/app/_schemas/zod/schema";
import { getErrorMessage } from "../action-utils";

// async function filterAsyncArray(array: any, employeeId: string) {
//   const filteredResults = await Promise.all(
//     array.map(async (schedule: any) => {
//       const isEven = await db.schedule.findMany({
//         where: {
//           userId: employeeId,
//           AND: [
//             {
//               startDate: { lt: schedule.endDate },
//               endDate: { gt: schedule.startDate },
//             },
//           ],
//         },
//       });;
//       return isEven ? schedule : null;
//     })
//   );

//   return filteredResults.filter((result) => result !== null);
// }

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
      console.log("results", results);
      return results;
    })
    .catch((e) => console.log(e));

  console.log("overlaps : ", overlap);

  // return overlap;
  if (
    overlap &&
    !!overlap.length &&
    overlap.some((item) => {
      console.log("item is true: ", !!true);
      return !!item;
    })
  )
    return { error: "Schedule overlap. Schedules not saved.", overlap };

  try {
    // TODO: loop thru schedules then use create instead of create many
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

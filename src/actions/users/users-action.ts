"use server";

import { db } from "@/app/_lib/db";
import { Department } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function getUser(department: Department) {
  noStore();

  const users = await db.user.findMany({
    include: { schedules: true },
    where: { profile: { department } },
  });
  if (!users) {
    const error = "Database error. Users fetch unsuccessful!";
    console.log(error);
    return { error };
  }
  return { success: "Users fetch successul!", data: users };
}

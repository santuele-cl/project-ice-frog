"use server";

import { db } from "@/app/_lib/db";
import { Department } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function getDepartments() {
  noStore();

  const departments = await db.department.findMany();

  if (!departments) {
    const error = "Database error. Departments fetch unsuccessful!";
    return { error };
  }
  return { success: "Departments fetch successul!", data: departments };
}

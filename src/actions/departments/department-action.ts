"use server";

import { db } from "@/app/_lib/db";
import { DepartmentSchema } from "@/app/_schemas/zod/schema";
import { Department } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { z } from "zod";
import { getErrorMessage } from "../action-utils";

type Sort = Record<keyof Department, "asc" | "desc">;

const ITEMS_PER_PAGE = 15;

export async function findDepartment({
  page = 1,
  email,
  department,
  sort,
  active,
}: {
  page?: number;
  email?: string;
  department?: string;
  sort?: Sort[];
  active?: boolean;
}) {
  noStore();

  try {
    const departments = await db.department.findMany({
      where: {
        // email: { contains: email },
        // profile: { department: { name: { in: department?.split(",") } } },
        // isActive: { equals: active },
      },
      orderBy: sort,
      // take: ITEMS_PER_PAGE,
      // skip: (Number(page) - 1) * ITEMS_PER_PAGE,
    });

    // console.log("departments : ", departments);

    if (!departments || departments.length < 1) {
      return { error: "No departments found!" };
    } else {
      return { success: "Departments found!", data: departments };
    }
  } catch (error) {
    return { error: "Something went wrong!" };
  }
}

export async function getDepartments() {
  noStore();

  const departments = await db.department.findMany();

  if (!departments) {
    const error = "Database error. Departments fetch unsuccessful!";
    return { error };
  }
  return { success: "Departments fetch successul!", data: departments };
}

export async function addDepartment({
  data,
}: {
  data: z.infer<typeof DepartmentSchema>;
}) {
  if (!data) return { error: "Missing data" };

  const parse = DepartmentSchema.safeParse(data);

  if (!parse.success) return { error: "Parse error!" };

  try {
    const newDeparment = await db.department.create({
      data,
    });

    if (!newDeparment) return { error: "Database error" };

    revalidatePath("/dashboard/deparments");

    return {
      success: `${newDeparment.name} department added!`,
      data: newDeparment,
    };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteDepartment(departmentId: string) {
  if (!departmentId) return { error: "Department ID missing!" };

  try {
    const existingDepartment = await db.department.findUnique({
      where: { id: departmentId },
    });

    if (!existingDepartment) return { error: "Department does not exist!" };

    const deletedDepartment = await db.department.delete({
      where: { id: departmentId },
    });
    if (!deletedDepartment) return { error: "Something went wrong" };

    revalidatePath("/dashboard/department");
    revalidatePath("/dashboard/archived/department");

    return {
      success: "Department Deleted successfully!",
      data: { id: deletedDepartment.id },
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

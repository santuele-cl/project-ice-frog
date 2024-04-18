"use server";

import { db } from "@/app/_lib/db";
import { Department } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { getErrorMessage } from "../action-utils";
import { NewEmployeeSchema } from "@/app/_schemas/zod/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

export async function createUserByAdminAcc(
  registerData: z.infer<typeof NewEmployeeSchema>
) {
  // console.log(registerData);

  if (!registerData) return { error: "Missing data" };

  const validatedData = NewEmployeeSchema.safeParse(registerData);

  if (!validatedData.success) return { error: "Data parse error" };

  const {
    email,
    role,
    password,
    confirmPassword,
    bdate,
    department,
    ...profileData
  } = validatedData.data;

  const isEmailTaken = await db.user.findUnique({ where: { email } });

  if (isEmailTaken) return { error: "Email already taken." };

  const isValidDepartment = await db.department.findUnique({
    where: { id: department },
  });

  if (!isValidDepartment) return { error: "Invalid department" };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        consent: true,
        profile: {
          create: {
            age: dayjs().diff(dayjs(bdate), "year"),
            bdate,
            ...profileData,
            departmentId: department,
          },
        },
      },
    });

    if (!user) return { error: "Something went wrong" };
    revalidatePath("/dashboard/employees");
    return { success: "Successful", data: { id: user.id, email: user.email } };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getEmployeeIds() {
  noStore();

  try {
    const user = await db.user.findMany({
      select: {
        id: true,
        profile: { select: { fname: true, lname: true } },
      },
    });

    if (!user) return { error: "Employee does not exist!" };

    return { success: "Success!", data: user };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getEmployeeById(id: string) {
  noStore();

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        email: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        profile: { include: { department: true } },
        schedules: { include: { project: true } },
      },
    });

    if (!user) return { error: "Employee does not exist!" };

    return { success: "Success!", data: user };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getEmployeesByDepartment() {
  noStore();

  const users = await db.user.findMany({
    include: { schedules: true, profile: true },
  });
  if (!users) {
    const error = "Database error. Users fetch unsuccessful!";
    console.log(error);
    return { error };
  }
  return { success: "Users fetch successul!", data: users };
}

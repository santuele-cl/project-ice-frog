"use server";
import { db } from "@/app/_lib/db";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { getErrorMessage } from "../action-utils";
import {
  EditEmployeeSchema,
  NewEmployeeSchema,
} from "@/app/_schemas/zod/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { auth } from "@/auth";

export async function updateEmployeeDetails({
  employeeId,
  values,
}: {
  employeeId: string;
  values: z.infer<typeof EditEmployeeSchema>;
}) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const user = await db.user.findUnique({ where: { id: employeeId } });

    if (!user) return { error: "Employee does not exist!" };

    const parse = EditEmployeeSchema.safeParse(values);

    if (!parse.success) return { error: "Parse error. Invalid data" };

    const { password, confirmPassword, email, role, ...profileData } =
      parse.data;
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        password,
        email,
        role,
        profile: { update: { data: { ...profileData } } },
      },
    });

    if (!updatedUser) return { error: "Something went wrong" };
    revalidatePath("/dashboard/employees/");
    revalidatePath("/dashboard/employees/[id]/edit");
    return { success: "Success!", data: updatedUser };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function createUserByAdminAcc(
  registerData: z.infer<typeof NewEmployeeSchema>
) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!registerData) return { error: "Missing data" };

    const validatedData = NewEmployeeSchema.safeParse(registerData);
    if (!validatedData.success) return { error: "Data parse error" };

    const {
      email,
      role,
      password,
      confirmPassword,
      bdate,
      departmentId,
      ...profileData
    } = validatedData.data;

    const isEmailTaken = await db.user.findUnique({ where: { email } });
    if (isEmailTaken) return { error: "Email already taken." };

    const isValidDepartment = await db.department.findUnique({
      where: { id: departmentId },
    });
    if (!isValidDepartment) return { error: "Invalid department" };

    const hashedPassword = await bcrypt.hash(password, 10);

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
            departmentId: departmentId,
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
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const user = await db.user.findMany({
      where: { isArchived: false },
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

export async function getCompleteEmployeeDetailsById(id: string) {
  noStore();
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const user = await db.user.findUnique({
      where: { id, isArchived: false },
      include: {
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
export async function getEmployeeById(id: string) {
  noStore();
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const user = await db.user.findUnique({
      where: { id, isArchived: false },
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
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    const users = await db.user.findMany({
      where: { isArchived: false },
      include: { schedules: true, profile: true },
    });
    if (!users) {
      const error = "Database error. Users fetch unsuccessful!";
      console.log(error);
      return { error };
    }
    return { success: "Users fetch successul!", data: users };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function EmployeeArchive(employeeId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!employeeId) return { error: "Employee ID missing!" };

    const existingEmployee = await db.user.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) return { error: "Employee does not exist!" };

    const archive = await db.user.update({
      where: { id: employeeId },
      data: { isArchived: true, isActive: false },
    });
    if (!archive) return { error: "Something went wrong" };

    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/archived");

    return { success: "Data archived successfully!", data: { id: archive.id } };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function EmployeeRestore(employeeId: string) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthenticated" };
    if (session.user.role !== "ADMIN") return { error: "Unauthorized" };

    if (!employeeId) return { error: "Employee ID missing!" };

    const existingEmployee = await db.user.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) return { error: "Employee does not exist!" };

    const archive = await db.user.update({
      where: { id: employeeId },
      data: { isArchived: false, isActive: true },
    });
    if (!archive) return { error: "Something went wrong" };

    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/archived");

    return { success: "Data archived successfully!", data: { id: archive.id } };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function EmployeeDelete(employeeId: string) {
  try {
    if (!employeeId) return { error: "Employee ID missing!" };

    const existingEmployee = await db.user.findUnique({
      where: { id: employeeId, isArchived: true },
    });

    if (!existingEmployee) return { error: "Employee does not exist!" };

    const deletedUser = await db.user.delete({
      where: { id: employeeId },
    });
    if (!deletedUser) return { error: "Something went wrong" };

    revalidatePath("/dashboard/employees");
    revalidatePath("/dashboard/archived");

    return {
      success: "Deleted successfully!",
      data: { id: deletedUser.id },
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

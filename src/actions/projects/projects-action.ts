"use server";

import { db } from "@/app/_lib/db";
import { RoleSchema } from "@/app/_schemas/zod/schema";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { getErrorMessage } from "../action-utils";

export async function getProjects() {
  noStore();

  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (!projects) return { error: "Database error. Fetch unsuccessful!" };

  return { success: "Success!", data: projects };
}

export async function getProjectById(id: string) {
  noStore();

  try {
    const project = await db.project.findUnique({
      where: { id },
      include: {
        schedules: {
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
        },
      },
    });
    if (!project) return { error: "Project does not exist!" };
    return { success: "Success!", data: project };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

// export async function addRole(roleData: z.infer<typeof RoleSchema>) {
//   if (!roleData) return { error: "Missing data!" };

//   const parse = RoleSchema.safeParse(roleData);

//   if (!parse.success) return { error: "Invalid data!" };

//   const isExisting = await db.employeeRole.findUnique({
//     where: { id: parse.data.id },
//   });

//   if (isExisting) return { error: "Role ID taken!" };

//   const newRole = await db.employeeRole.create({ data: roleData });
//   if (!newRole) return { error: "Database error" };

//   revalidatePath("/dashboard/roles-and-permissions");

//   return { success: "Role added!", data: newRole };
// }

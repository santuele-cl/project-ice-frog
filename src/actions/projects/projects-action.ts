"use server";

import { db } from "@/app/_lib/db";
import { ProjectSchema } from "@/app/_schemas/zod/schema";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { getErrorMessage } from "../action-utils";

export async function addProject(values: z.infer<typeof ProjectSchema>) {
  const parse = ProjectSchema.safeParse(values);

  if (!parse.success) return { error: "Parse error. Invalid data input!" };

  const { schedules, ...otherFields } = parse.data;

  try {
    const newProject = await db.project.create({
      data: {
        ...otherFields,
        ...(schedules &&
          !!schedules.length && {
            schedules: { createMany: { data: [...schedules] } },
          }),
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: "Schedule(s) added!", data: newProject };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getProjects() {
  noStore();

  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!projects) return { error: "Cannot find requested resources" };
    return { success: "Success!", data: projects };
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getProjectScheduleGroupByUserId(projectId: string) {
  noStore();

  const projects = await db.schedule.groupBy({
    by: ["userId"],
    where: { projectId },
  });

  if (!projects) return { error: "Database error. Fetch unsuccessful!" };

  return { success: "Success!", data: projects };
}

export async function getProjectById(id: string) {
  noStore();

  try {
    const project = await db.project.findUnique({
      where: { id },
    });
    if (!project) return { error: "Project does not exist!" };
    return { success: "Success!", data: project };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

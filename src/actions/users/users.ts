"use server";

import { db } from "@/app/_lib/db";
import { Profile, User } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

type Sort = Record<keyof User, "asc" | "desc">;
type Filter = Record<keyof User | keyof Profile, string>;

interface SearchQUery {
  page: number;
  sort: Sort[];
  filter: Filter[];
}

const ITEMS_PER_PAGE = 15;

export async function findUser({
  page = 1,
  email,
  name,
  department,
  sort,
  active,
  isArchived = false,
}: {
  page?: number;
  email?: string;
  name?: string;
  department?: string;
  sort?: Sort[];
  active?: boolean;
  isArchived?: boolean;
}) {
  noStore();

  try {
    const users = await db.user.findMany({
      where: {
        isArchived: isArchived,
        email: { contains: email },
        OR: [
          { profile: { fname: { contains: name } } },
          { profile: { mname: { contains: name } } },
          { profile: { lname: { contains: name } } },
        ],
        profile: { department: { name: { in: department?.split(",") } } },
        isActive: { equals: active },
      },
      orderBy: sort,
      include: {
        profile: {
          select: {
            contactNumber: true,
            department: true,
            fname: true,
            lname: true,
            occupation: true,
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: (Number(page) - 1) * ITEMS_PER_PAGE,
    });

    if (!users || users.length < 1) {
      return { error: "No users found!" };
    } else {
      return { success: "Users found!", data: users };
    }
  } catch (error) {
    return { error: "Something went wrong!" };
  }
}

export async function getUserById(id: string) {
  noStore();

  if (!id) return { error: "Missing ID!" };

  const user = await db.user.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!user) return { error: "User not found!" };

  return { success: "User data fetched!", data: user };
}

export async function getTotalUsersCount() {
  noStore();
  try {
    const total = await db.user.count();
    return { success: "Success!", data: total };
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }
}

export async function getTotalActiveUser() {
  noStore();
  try {
    const totalActive = await db.user.count({ where: { isActive: true } });
    return { success: "Success!", data: totalActive };
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }
}

export async function getTotalInactiveUser() {
  noStore();
  try {
    const totalActive = await db.user.count({ where: { isActive: false } });
    return { success: "Success!", data: totalActive };
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }
}

export async function toggleUserIsActive(userId: string) {
  if (!userId) return { error: "Missing ID" };
  try {
    const existingUser = await db.user.findUnique({ where: { id: userId } });
    if (!existingUser) return { error: "User not found!" };

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        isActive: !existingUser.isActive,
      },
    });

    if (!updatedUser)
      return { error: "An error has occured. Update unsuccessful!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
}

"use server";

import { db } from "@/app/_lib/db";
import { Prisma, Profile, User } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { getErrorMessage } from "../action-utils";

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
  occupation,
  name,
  department,
  active,
  isArchived = false,
}: {
  page?: number;
  occupation?: string;
  name?: string;
  department?: string;
  active?: boolean;
  isArchived?: boolean;
}) {
  noStore();
  try {
    const findUserQuery = {
      where: {
        isArchived: isArchived,
        ...(name && {
          OR: [
            {
              profile: {
                fname: { contains: name, mode: "insensitive" },
              },
            },
            {
              profile: {
                mname: { contains: name, mode: "insensitive" },
              },
            },
            {
              profile: {
                lname: { contains: name, mode: "insensitive" },
              },
            },
          ],
        }),
        profile: {
          department: { name: { in: department?.split(",") } },
          occupation: { contains: occupation, mode: "insensitive" },
        },
        isActive: { equals: active },
      },
      orderBy: { createdAt: "desc" },
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
    } as Prisma.UserFindManyArgs;

    const [users, count] = await db.$transaction([
      db.user.findMany(findUserQuery),
      db.user.count({ where: findUserQuery.where }),
    ]);

    return {
      success: "Success",
      data: users,
      pagination: {
        totalCount: count,
        itemsPerPage: ITEMS_PER_PAGE,
        totalPages: Math.ceil(count / ITEMS_PER_PAGE),
      },
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
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

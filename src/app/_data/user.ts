import { db } from "@/app/_lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email, isArchived: false },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id, isArchived: false },
      include: {
        profile: { select: { department: { select: { name: true } } } },
      },
    });

    return user;
  } catch {
    return null;
  }
};

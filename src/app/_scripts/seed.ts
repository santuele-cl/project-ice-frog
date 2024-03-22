import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const seed = async () => {
  const USER_ADMIN1 = await db.user.createMany({
    data: [
      {
        id: "ADMIN1",
        email: "kabi678goo@gmail.com",
        role: "ADMIN",
        consent: true,
        emailVerified: "2024-03-22T12:00:00Z",
        password:
          "$2a$10$ib5/DxaL4moUGxl66UXdw.2E5QxVktgSvLy6qAihoBg.Fle3waMhy",
      },
    ],
  });

  const USER_EMPLOYEE1 = await db.user.createMany({
    data: [
      {
        id: "EMPLOYEE1",
        email: "papisssgg@gmail.com",
        role: "EMPLOYEE",
        consent: true,
        emailVerified: "2024-03-22T12:00:00Z",
        password:
          "$2a$10$ib5/DxaL4moUGxl66UXdw.2E5QxVktgSvLy6qAihoBg.Fle3waMhy",
      },
    ],
  });
};

seed()
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const seed = async () => {
  const ADMIN1 = await db.user.upsert({
    where: { id: "ADMIN1" },
    update: {},
    create: {
      id: "ADMIN1",
      email: "kabi678goo@gmail.com",
      role: "ADMIN",
      consent: true,
      emailVerified: "2024-03-22T12:00:00Z",
      password: "$2a$10$ib5/DxaL4moUGxl66UXdw.2E5QxVktgSvLy6qAihoBg.Fle3waMhy",
      profile: {
        create: {
          id: "PROFILE0",
          fname: "Emily",
          lname: "Davis",
          gender: "FEMALE",
          bdate: "1995-11-28T00:00:00Z",
          age: 29,
          contactNumber: "+1555123456",
          department: "CUSTOMIZED",
          occupation: "Financial Analyst",
        },
      },
    },
  });

  const EMPLOYEE1 = await db.user.upsert({
    where: { id: "EMPLOYEE1" },
    update: {},
    create: {
      id: "EMPLOYEE1",
      email: "papisssgg@gmail.com",
      role: "EMPLOYEE",
      consent: true,
      emailVerified: "2024-03-22T12:00:00Z",
      password: "$2a$10$ib5/DxaL4moUGxl66UXdw.2E5QxVktgSvLy6qAihoBg.Fle3waMhy",
      profile: {
        create: {
          id: "PROFILE1",
          fname: "John",
          mname: "Edward",
          lname: "Doe",
          gender: "MALE",
          bdate: "1990-05-15T00:00:00Z",
          age: 31,
          contactNumber: "+1234567890",
          department: "TECHNOLOGY",
          occupation: "Software Engineer",
        },
      },
    },
  });

  const EMPLOYEE2 = await db.user.upsert({
    where: { id: "EMPLOYEE2" },
    update: {},
    create: {
      id: "EMPLOYEE2",
      email: "royfrancis@gmail.com",
      role: "EMPLOYEE",
      consent: true,
      emailVerified: "2024-03-22T12:00:00Z",
      password: "$2a$10$ib5/DxaL4moUGxl66UXdw.2E5QxVktgSvLy6qAihoBg.Fle3waMhy",
      profile: {
        create: {
          id: "PROFILE2",
          fname: "Alice",
          lname: "Smith",
          gender: "FEMALE",
          bdate: "1985-09-20T00:00:00Z",
          age: 36,
          contactNumber: "+1987654321",
          department: "SYSTEMS",
          occupation: "HR Manager",
        },
      },
    },
  });

  const EMPLOYEE3 = await db.user.upsert({
    where: { id: "EMPLOYEE3" },
    update: {},
    create: {
      id: "EMPLOYEE3",
      email: "csan@gmail.com",
      role: "EMPLOYEE",
      consent: true,
      emailVerified: "2024-03-22T12:00:00Z",
      password: "$2a$10$ib5/DxaL4moUGxl66UXdw.2E5QxVktgSvLy6qAihoBg.Fle3waMhy",
      profile: {
        create: {
          id: "PROFILE3",
          fname: "Michael",
          lname: "Johnson",
          gender: "MALE",
          bdate: "1982-03-10T00:00:00Z",
          age: 42,
          contactNumber: "+1122334455",
          department: "CUSTOMIZED",
          occupation: "Marketing Analyst",
        },
      },
    },
  });

  const PROJECTS = await db.project.createMany({
    data: [
      {
        id: "p1",
        name: "Website Redesign",
        jobOrder: "JO123",
        location: "New York",
        notes: "Client wants a modern and responsive design.",
      },
      {
        id: "p2",
        name: "Mobile App Development",
        jobOrder: "JO456",
        location: "San Francisco",
        notes: "Building a cross-platform app for iOS and Android.",
      },
    ],
  });

  const SCHEDULUES = await db.schedule.createMany({
    data: [
      {
        id: "s1",
        projectId: "p1",
        startDate: "2024-03-26T09:00:00Z",
        endDate: "2024-03-26T17:00:00Z",
        userId: "EMPLOYEE1",
      },
      {
        id: "s2",
        projectId: "p2",
        startDate: "2024-03-27T10:00:00Z",
        endDate: "2024-03-27T18:00:00Z",
        userId: "EMPLOYEE1",
      },
      {
        id: "s3",
        projectId: "p1",
        startDate: "2024-03-31T10:00:00Z",
        endDate: "2024-03-31T18:00:00Z",
        userId: "EMPLOYEE2",
      },
      {
        id: "s4",
        projectId: "p2",
        startDate: "2024-03-28T09:00:00Z",
        endDate: "2024-03-28T17:00:00Z",
        userId: "EMPLOYEE2",
      },
      {
        id: "s5",
        projectId: "p1",
        startDate: "2024-03-29T10:00:00Z",
        endDate: "2024-03-29T18:00:00Z",
        userId: "EMPLOYEE3",
      },
      {
        id: "s6",
        projectId: "p2",
        startDate: "2024-03-30T09:00:00Z",
        endDate: "2024-03-30T17:00:00Z",
        userId: "EMPLOYEE3",
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

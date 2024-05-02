import { Gender, Role, Department } from "@prisma/client";
import dayjs from "dayjs";
import { z } from "zod";

export const DepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required!")
    .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
  head: z
    .string()
    .min(1, "Department head is required!")
    .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
});

export const RegisterSchema = z.object({
  fname: z
    .string()
    .min(1, "First Name is required!")
    .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
  mname: z.string().optional(),
  lname: z
    .string()
    .min(1, "Last Name is required!")
    .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
  suffix: z.string().optional(),
  gender: z.nativeEnum(Gender),
  bdate: z.coerce.date(),
  age: z.coerce.number(),
  contactNumber: z
    .string()
    .regex(new RegExp(/^(09|\+639)\d{9}$/), "Invalid phone format"),
  occupation: z
    .string()
    .min(1, "Occupation is required!")
    .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
  department: z.string().min(1, "Department is required"),
  email: z.string().email("Email is required!"),
  password: z.string().min(1, "Password is required!"),
  confirmPassword: z.string().min(1, "Password is required!"),
  role: z.nativeEnum(Role),
  consent: z.boolean().refine((value) => value === true, {
    message: "Consent required!",
  }),
});

export const NewEmployeeSchema = z
  .object({
    fname: z
      .string()
      .min(1, "First Name is required!")
      .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
    mname: z.string().optional(),
    lname: z
      .string()
      .min(1, "Last Name is required!")
      .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
    suffix: z.string().optional(),
    gender: z.nativeEnum(Gender),
    bdate: z.date(),
    contactNumber: z
      .string()
      .regex(new RegExp(/^(09|\+639)\d{9}$/), "Invalid phone format"),
    occupation: z
      .string()
      .min(1, "Occupation is required!")
      .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
    departmentId: z
      .string({ invalid_type_error: "Invalid input" })
      .min(1, "Department is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    role: z.nativeEnum(Role),

    password: z.string().min(1, "Password is required!"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const EditEmployeeSchema = z
  .object({
    fname: z
      .string()
      .min(1, "First Name is required!")
      .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
    mname: z.string().optional(),
    lname: z
      .string()
      .min(1, "Last Name is required!")
      .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
    suffix: z.string().optional(),
    gender: z.nativeEnum(Gender),
    bdate: z.coerce.date(),
    contactNumber: z
      .string()
      .regex(new RegExp(/^(09|\+639)\d{9}$/), "Invalid phone format"),
    occupation: z
      .string()
      .min(1, "Occupation is required!")
      .regex(new RegExp(/^[a-zA-Z .]+$/), "Invalid input"),
    departmentId: z
      .string({ invalid_type_error: "Invalid input" })
      .min(1, "Department is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    role: z.nativeEnum(Role),
    password: z
      .union([z.string().min(6, "Min. of 6 characters"), z.string().length(0)])
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
    confirmPassword: z
      .string()
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ScheduleSchema = z.object({
  projectId: z.string().min(1, "Required field"),
  userId: z.string().min(1, "Required field"),
  notes: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
});

export const EditScheduleSchema = z
  .object({
    projectId: z.string().min(1, "Required field"),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date.",
    path: ["endDate"],
  });

export const ScheduleSchemaWithoutProjectId = ScheduleSchema.omit({
  projectId: true,
});

export const ScheduleSchemaWithoutProjectIdWithDateRefine =
  ScheduleSchemaWithoutProjectId.refine(
    (data) =>
      data.startDate >=
      new Date(dayjs().year(), dayjs().month(), dayjs().day()),
    {
      message: "Cannot set past date as start date",
      path: ["startDate"],
    }
  ).refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date.",
    path: ["endDate"],
  });

export const ScheduleSchemaWithDateRefine = ScheduleSchema.refine(
  (data) =>
    data.startDate >= new Date(dayjs().year(), dayjs().month(), dayjs().day()),
  {
    message: "Cannot set past date as start date",
    path: ["startDate"],
  }
).refine((data) => data.endDate > data.startDate, {
  message: "End date must be greater than start date.",
  path: ["endDate"],
});

export const SchedulesSchema = z.object({
  schedules: z.array(ScheduleSchemaWithDateRefine).refine(
    (schedules) => {
      const overlaps = schedules.filter((scheduleA, i) => {
        const isOverlapping = schedules.some((scheduleB, j) => {
          if (i !== j) {
            return (
              scheduleA.startDate < scheduleB.endDate &&
              scheduleA.endDate > scheduleB.startDate
            );
          } else {
            return false;
          }
        });
        return isOverlapping;
      });
      return !overlaps.length;
    },
    { message: "Schedule overlaps" }
  ),
});

export const ProjectSchema = z
  .object({
    name: z.string().min(1, "Required"),
    jobOrder: z.string().min(1, "Required"),
    street: z.string().optional(),
    building: z.string().optional(),
    city: z.string().min(1, "Required"),
    barangay: z.string().min(1, "Required"),
    startDate: z.date(),
    endDate: z.date(),
    notes: z.string().optional(),
    schedules: z.array(ScheduleSchemaWithoutProjectIdWithDateRefine).optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date.",
    path: ["endDate"],
  });

export const EditProjectSchema = z
  .object({
    name: z.string().min(1, "Required"),
    jobOrder: z.string().min(1, "Required"),
    street: z.string().optional(),
    building: z.string().optional(),
    city: z.string().min(1, "Required"),
    barangay: z.string().min(1, "Required"),
    startDate: z.date(),
    endDate: z.date(),
    notes: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date.",
    path: ["endDate"],
  });

export const AppointmentSchema = z.object({
  title: z.string().min(1, "Required field"),
  room: z.string().min(1, "Required field"),
  reason: z.string().min(1, "Required field"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  patientId: z.string().min(1, "Required field"),
  employeeId: z.string().min(1, "Required field"),
});

export const RoleSchema = z.object({
  id: z.string().min(1, "Required field"),
  roleName: z
    .string()
    .min(1, "Required field")
    .regex(
      new RegExp(/^[a-zA-Z_]+$/),
      "Only letters, space and underscore allowed"
    ),
});

export const SettingsSchema = z.object({
  name: z.optional(z.string().min(1, "Minimum 1 character!")),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email("Email is required."),
});

export const NewPasswordSchema = z.object({
  newPassword: z.string().min(6, "Minimum of 6 character!"),
});

export const LoginSchema = z.object({
  email: z.string().email("Email is required."),
  password: z.string().min(1, "Password is required."),
  code: z.optional(z.string()),
});

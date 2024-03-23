import { Gender, Role, Department } from "@prisma/client";
import { z } from "zod";

export const RegisterSchema = z
  .object({
    // PROFILE
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
    department: z.nativeEnum(Department),
    // USER
    email: z.string().email("Email is required!"),
    password: z.string().min(1, "Password is required!"),
    confirmPassword: z.string().min(1, "Confirm password is required!"),
    role: z.nativeEnum(Role),
    consent: z.boolean().refine((value) => value === true, {
      message: "Consent required!",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const AppointmentSchema = z.object({
  title: z.string().min(1, "Required field"),
  // status: z.nativeEnum(AppointmentStatus),

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

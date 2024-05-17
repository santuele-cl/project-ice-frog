import { EmployeeRole, Role, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  role: Role;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  email: string;
  department: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {};
    role: Role;
    department: string;
  }
}

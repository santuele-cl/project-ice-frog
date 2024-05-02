/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

import { Role } from "@prisma/client";

type ERROR_ROUTES_TYPE = {
  [index: string]: string;
};

export const ERROR_ROUTES: ERROR_ROUTES_TYPE = {
  "not-found": "/error/not-found",
  unauthorized: "/error/unauthorized",
};

export const PUBLIC_ROUTES = [
  "/auth/new-verification",
  ...Object.keys(ERROR_ROUTES).map((route) => ERROR_ROUTES[route]),
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */

export const AUTH_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset-password",
  "/auth/new-password",
];

/**
 * The prefix for api authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const API_ROUTE_PREFIX = "/api/auth";

/**
 * The default redirect route after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = {
  [Role.ADMIN]: "/dashboard/schedules",
  [Role.EMPLOYEE]: "/dashboard/my-schedules/table",
  [Role.SUPER_ADMIN]: "/dashboard/schedules",
};

export const ADMIN_ROUTES = [
  "/dashboard/schedules",
  "/dashboard/projects",
  "/dashboard/employees",
  "/dashboard/departments",
  "/dashboard/archive",
];

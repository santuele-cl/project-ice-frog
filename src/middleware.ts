import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  AUTH_ROUTES,
  API_ROUTE_PREFIX,
  PUBLIC_ROUTES,
  ADMIN_ROUTES,
  ERROR_ROUTES,
} from "./routes";
import { getToken } from "next-auth/jwt";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  //@ts-expect-error
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET!,
    // salt: process.env.AUTH_SECRET!,
  });

  const { nextUrl } = req;
  const isLoggedIn = !!req?.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_ROUTE_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT[token?.role!], nextUrl)
      );
    }

    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(`/`, nextUrl));

    // let callbackUrl = nextUrl.pathname;
    // if (nextUrl.search) {
    //   callbackUrl += nextUrl.search;
    // }

    // const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // return Response.redirect(
    //   new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    // );
  }

  if (isAdminRoute) {
    if (token?.role !== "ADMIN") {
      return Response.redirect(new URL(ERROR_ROUTES["not-found"], nextUrl));
    }
    return;
  }

  return;
});

// Whatever listed in the matcher array will invoke the auth func above
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

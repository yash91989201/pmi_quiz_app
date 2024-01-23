import NextAuth from "next-auth";
// UTILS
import { authConfig } from "@/config/auth.config";
// CONSTANTS
import { apiAuthPrefix, authRoutes, publicRoutes } from "@/config/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth } = req;

  const isLoggedIn = !!auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const notAuthenticatedRedirect = nextUrl.pathname.startsWith("/admin")
    ? "/auth/admin/login"
    : "/auth/login";

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(notAuthenticatedRedirect, req.url));
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

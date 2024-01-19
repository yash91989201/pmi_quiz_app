import {
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_USER_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/config/routes";
import authConfig from "@/config/auth.config";
import NextAuth from "next-auth";
// import { getToken } from "next-auth/jwt";
// // import nextAuth from "next-auth";
// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//   async function middleware(req) {
//     const { nextUrl } = req;
//     const token = await getToken({ req });
//     const isLoggedIn = token !== null;

//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//     if (isApiAuthRoute) return null;

//     if (isAuthRoute) {
//       if (isLoggedIn) {
//         if (token.role === "ADMIN") {
//           return Response.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
//         } else if (token.role === "USER") {
//           return Response.redirect(new URL(DEFAULT_USER_REDIRECT, nextUrl));
//         }
//       }
//       return null;
//     }

//     if (!isLoggedIn && !isPublicRoute) {
//       const url = new URL("/auth/login", req.url);
//       url.searchParams.set("callbackUrl", nextUrl.href);
//       return Response.redirect(url);
//     }

//     return null;
//   },
//   {
//     callbacks: {
//       authorized: () => true,
//     },
//   },
// );

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      switch (user?.role) {
        case "ADMIN": {
          console.log("admin");
          return Response.redirect(new URL(DEFAULT_ADMIN_REDIRECT, nextUrl));
        }
        case "USER": {
          return Response.redirect(new URL(DEFAULT_USER_REDIRECT, nextUrl));
        }
        default: {
          return null;
        }
      }
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", nextUrl.href);
    return Response.redirect(url);
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

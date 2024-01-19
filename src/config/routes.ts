/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in as ADMIN role
 * @type {string}
 */
export const DEFAULT_ADMIN_REDIRECT = "/admin";
/**
 * The default redirect path after logging in as USER role
 * @type {string}
 */
export const DEFAULT_USER_REDIRECT = "/quiz";

/**
 * Links available under admin dashboard
 */
export const NAV_LINKS = [
  {
    label: "Users",
    href: "/admin/users",
  },
  {
    label: "Quizzes",
    href: "/admin/quizzes",
  },
  {
    label: "Settings",
    href: "/admin/settings",
  },
] as const;

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
  "/auth/admin/login",
  "/auth/admin/sign-up",
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
export const DEFAULT_ADMIN_REDIRECT = "/admin/users";
/**
 * The default redirect path after logging in as USER role
 * @type {string}
 */
export const DEFAULT_USER_REDIRECT = "/quizzes";
/**
 * Redirect user to update their email and password
 * after logging in for first time
 * @type {string}
 */
export const USER_UPDATE_REDIRECT = "/profile/update";

/**
 * Links available under ADMIN dashboard
 */
export const ADMIN_NAV_LINKS = [
  {
    label: "Users",
    href: "/admin/users",
    matchExact: false,
  },
  {
    label: "Exams",
    href: "/admin/quizzes",
    matchExact: false,
  },
  {
    label: "Order Status",
    href: "/admin/orders",
    matchExact: false,
  },
] as const;

/**
 * Links available under USER dashboard
 */
export const USER_NAV_LINKS = [
  {
    label: "Exams",
    href: "/quizzes",
    matchExact: false,
  },
  {
    label: "Order Status",
    href: "/orders",
    matchExact: false,
  },
  {
    label: "Results",
    href: "/certificates",
    matchExact: false,
  },
] as const;

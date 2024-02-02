/**
 * Dummy email constant for users with ROLE = "USER"
 * This dummy email is temporary and users will neeed to change once they have logged in
 * @type {string}
 */
export const DUMMY_EMAIL_PREFIX = "dummy_email_temporary";

/**
 * status text for user quiz status
 * @type {string[]}
 */
export const STATUS_TEXT = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

/**
 * abstract pattern paths for showing quiz card
 * @type {string[]}
 */
export const ABSTRACT_PATTERN_PATHS: string[] = [
  "/assets/dot-grid.webp",
  "/assets/memphis-colorful.webp",
  "/assets/memphis-mini.webp",
  "/assets/spiration-light.webp",
  "/assets/swirl_pattern.webp",
  "/assets/tic-tac-toe.webp",
  "/assets/topography.webp",
  "/assets/webb.webp",
  "/assets/what-the-hex.webp",
  "/assets/y-so-serious-white.webp",
] as const;

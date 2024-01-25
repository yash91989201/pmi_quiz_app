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

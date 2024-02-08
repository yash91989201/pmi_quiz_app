import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { twMerge } from "tailwind-merge";
import { createId } from "@paralleldrive/cuid2";
import { toast } from "sonner";
// TYPES
import type { ClassValue } from "clsx";
import type { FunctionComponent } from "react";
// CONSTANTS
import { ABSTRACT_PATTERN_PATHS, DUMMY_EMAIL_PREFIX } from "@/config/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function paginationWithEllepsis({
  current,
  max,
}: PaginationParams): PaginationResult {
  const prev = current === 1 ? current : current - 1;
  const next = current === max ? max : current + 1;
  const items = ["1"];

  if (current === 1 && max === 1) return { current, prev, next, items };

  if (current > 4) items.push("…");

  const r = 2;
  const r1 = current - r;
  const r2 = current + r;

  for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++)
    items.push(i.toString());

  if (r2 + 1 < max) items.push("…");
  if (r2 < max) items.push(max.toString());

  return { current, prev, next, items };
}

export function renderOnClient<T>(Component: FunctionComponent<T>) {
  return dynamic(() => Promise.resolve(Component), { ssr: false });
}

export function formatAmount(amount: number): string {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  return formattedAmount;
}

export function formatDate(date: Date): string {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  return formattedDate;
}

/**
 * This function will create a dummy email
 * prefixed with DUMMY_EMAIL_PREFIX
 */
export function generateRandomDummyEmail() {
  const randomId = createId();
  return `${DUMMY_EMAIL_PREFIX}${randomId}@gmail.com`;
}

/**
 * shows toast for update action performed
 * on user or quiz data
 */
export function editActionToast(action?: {
  status: "SUCCESS" | "FAILED";
  message: string;
}) {
  if (action !== undefined) {
    if (action.status === "SUCCESS") {
      toast.success(action.message);
    } else {
      toast.error(action.message);
    }
  }
}

export function getRandomizedPatternPath() {
  const randomNumber = Math.floor(
    Math.random() * ABSTRACT_PATTERN_PATHS.length,
  );
  return ABSTRACT_PATTERN_PATHS[randomNumber];
}

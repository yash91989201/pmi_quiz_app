import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { twMerge } from "tailwind-merge";
// TYPES
import type { ClassValue } from "clsx";
import type { FunctionComponent } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PaginationResult = {
  current: number;
  prev: number;
  next: number;
  items: string[];
};

type PaginationParams = {
  current: number;
  max: number;
};

function paginationWithEllepsis({
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

function renderOnClient<T>(Component: FunctionComponent<T>) {
  return dynamic(() => Promise.resolve(Component), { ssr: false });
}

function formatAmount(amount: number): string {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  return formattedAmount;
}

function formatDate(date: Date): string {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  return formattedDate;
}

export { cn, renderOnClient, paginationWithEllepsis, formatAmount, formatDate };

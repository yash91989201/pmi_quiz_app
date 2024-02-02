"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NavLink({
  href,
  label,
  matchExact,
}: {
  href: string;
  label: string;
  matchExact: boolean;
}) {
  const pathname = usePathname();

  const isActive = matchExact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: "link",
          className: isActive ? "text-primary underline" : "text-gray-700",
        }),
        "px-2 text-base",
      )}
    >
      {label}
    </Link>
  );
}

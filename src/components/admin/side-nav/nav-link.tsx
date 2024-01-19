"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// UTILS
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          variant: pathname.startsWith(href) ? "default" : "ghost",
          className: "justify-start",
        }),
      )}
    >
      {label}
    </Link>
  );
}

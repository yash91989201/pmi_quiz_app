"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// ICONS
import { ChevronRight } from "lucide-react";

export default function UserPageBreadcrumbs({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const pathname = usePathname();
  const isOnEditPage = pathname.endsWith("edit-user");
  const isOnModifyUserQuizzespage = pathname.endsWith("modify-user-quizzes");

  return (
    <nav className="flex w-fit items-center justify-center gap-2  [&>svg]:size-4 [&>svg]:text-gray-600">
      <Link
        href="/admin/users"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 rounded-full px-3 py-1 last:pointer-events-none",
        )}
      >
        Users
      </Link>
      <ChevronRight />
      <Link
        href={`/admin/users/${id}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 rounded-full px-3 py-1 last:pointer-events-none",
        )}
      >
        {name}
      </Link>
      {isOnEditPage && (
        <>
          <ChevronRight />
          <Link
            href={`/admin/users/${id}/update-user`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-8 rounded-full px-3 py-1 last:pointer-events-none",
            )}
          >
            Update User
          </Link>
        </>
      )}
      {isOnModifyUserQuizzespage && (
        <>
          <ChevronRight />
          <Link
            href={`/admin/users/${id}/modify-user-quizzes`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-8 rounded-full px-3 py-1",
            )}
          >
            Quiz Result
          </Link>
        </>
      )}
    </nav>
  );
}

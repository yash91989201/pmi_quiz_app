import { redirect } from "next/navigation";
// UTILS
import { currentRole, currentUser } from "@/server/utils/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import UserNavbar from "@/components/user/user-navbar";
import { api } from "@/trpc/server";
import { cn } from "@/lib/utils";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();
  const userRole = await currentRole();

  if (!user) redirect("/auth/login");
  if (userRole === "ADMIN") redirect("/admin");

  const inProgressQuizzes = await api.user.getInProgressQuizzes.query();

  return (
    <>
      {inProgressQuizzes.length > 0 ? null : <UserNavbar />}
      <div
        className={cn(
          "min-h-screen",
          inProgressQuizzes.length > 0 && "bg-primary/15",
        )}
      >
        <main className="mx-auto h-full max-w-6xl py-6">
          <section>{children}</section>
        </main>
      </div>
    </>
  );
}

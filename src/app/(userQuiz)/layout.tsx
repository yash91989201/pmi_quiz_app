import { redirect } from "next/navigation";
// UTILS
import { currentRole, currentUser } from "@/server/utils/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();
  const userRole = await currentRole();

  if (!user) redirect("/auth/login");
  if (userRole === "ADMIN") redirect("/admin");

  return (
    <div className="min-h-screen bg-primary/15">
      <main className="mx-auto h-full max-w-6xl py-6">
        <section>{children}</section>
      </main>
    </div>
  );
}

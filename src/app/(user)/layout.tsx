import { redirect } from "next/navigation";
// UTILS
import { currentRole } from "@/server/utils/auth";
// TYPES
import type { ReactNode } from "react";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userRole = await currentRole();

  if (userRole === "ADMIN") redirect("/admin");

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">{children}</main>
  );
}

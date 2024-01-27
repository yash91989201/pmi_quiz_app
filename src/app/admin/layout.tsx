import { redirect } from "next/navigation";
// UTILS
import { currentRole } from "@/server/utils/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import SideNav from "@/components/admin/side-nav";
import MobileNav from "@/components/admin/mobile-nav";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userRole = await currentRole();

  if (userRole === "USER") redirect("/quizzes");

  return (
    <main className="flex h-screen flex-col overflow-hidden lg:flex-row">
      <SideNav />
      <MobileNav />
      <section className="flex-1 overflow-y-auto p-3 lg:max-h-screen lg:pb-8 ">
        {children}
      </section>
    </main>
  );
}

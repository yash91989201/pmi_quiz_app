import { redirect } from "next/navigation";
// UTILS
import { currentRole, currentUser } from "@/server/utils/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import SideNav from "@/components/user/side-nav";

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
    <main className="relative flex flex-col lg:flex-row lg:overflow-hidden">
      <SideNav />
      <section className="flex-1 overflow-y-auto p-3 lg:max-h-screen">
        {children}
      </section>
    </main>
  );
}

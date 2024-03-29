import { redirect } from "next/navigation";
// UTILS
import { currentRole, currentUser } from "@/server/utils/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import UserNavbar from "@/components/user/user-navbar";

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
    <>
      <UserNavbar />
      <div className="min-h-screen">
        <main className="mx-auto h-full w-11/12 py-6  sm:w-4/5 lg:max-w-6xl">
          <section>{children}</section>
        </main>
      </div>
    </>
  );
}

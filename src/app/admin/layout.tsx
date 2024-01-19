import SideNav from "@/components/admin/side-nav/side-nav";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <SideNav />
      <section className="flex-1 p-3">{children}</section>
    </main>
  );
}

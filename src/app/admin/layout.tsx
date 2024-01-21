// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import SideNav from "@/components/admin/side-nav/side-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <SideNav />
      <section className="flex-1 overflow-auto p-3 lg:h-screen">
        {children}
      </section>
    </main>
  );
}

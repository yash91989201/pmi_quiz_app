import LogoutButton from "@/components/admin/side-nav/logout-button";
import NavLinks from "@/components/admin/side-nav/nav-links";

export default function SideNav() {
  return (
    <aside className="flex h-screen w-72 flex-shrink-0 flex-col gap-6 border-r p-3">
      {/* heading section */}
      <section className="flex min-h-36 flex-col justify-end rounded-lg bg-primary/25 p-3 text-3xl">
        <h2>PMI</h2>
      </section>
      {/* navigation section */}
      <section className="flex flex-1 flex-col">
        <nav className="flex flex-1 flex-col gap-3">
          <NavLinks />
        </nav>
        <LogoutButton />
      </section>
    </aside>
  );
}

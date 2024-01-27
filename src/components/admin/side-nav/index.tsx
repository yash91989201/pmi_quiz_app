// CUSTOM COMPONENTS
import NavLinks from "@/components/admin/side-nav/nav-links";
import LogoutButton from "@/components/admin/side-nav/logout-button";

export default function SideNav() {
  return (
    <aside className="hidden h-screen w-72 flex-shrink-0 flex-col gap-6 border-r p-3 lg:flex">
      {/* heading section */}
      <section className="flex min-h-36 flex-col justify-end rounded-lg bg-primary p-3 ">
        <h2 className="text-5xl font-semibold text-primary-foreground">PMI</h2>
      </section>
      {/* navigation section */}
      <section className="flex flex-1 flex-col">
        <nav className="flex flex-1 flex-col items-stretch gap-3">
          <NavLinks />
        </nav>
        <LogoutButton />
      </section>
    </aside>
  );
}

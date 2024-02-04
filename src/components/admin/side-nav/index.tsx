// CUSTOM COMPONENTS
import NavLinks from "@/components/admin/side-nav/nav-links";
import LogoutButton from "@/components/admin/side-nav/logout-button";
import Image from "next/image";

export default function SideNav() {
  return (
    <aside className="hidden h-screen w-64  flex-shrink-0 flex-col gap-6 border-r p-3 lg:flex xl:w-72">
      {/* heading section */}
      <section className="flex min-h-40 flex-col justify-end rounded-lg bg-primary/15 p-3 xl:min-h-44 ">
        <div className="relative h-14 w-full xl:h-[4.5rem]">
          <Image src="/assets/pmi_logo.webp" alt="PMI" fill />
        </div>
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

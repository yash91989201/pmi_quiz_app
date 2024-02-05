// CUSTOM COMPONENTS
import NavLinks from "@/components/admin/side-nav/nav-links";
import LogoutButton from "@/components/admin/side-nav/logout-button";
import Image from "next/image";

export default function SideNav() {
  return (
    <aside className="hidden h-screen w-64  flex-shrink-0 flex-col gap-6 border-r p-3 lg:flex xl:w-72">
      {/* heading section */}
      <section className="flex min-h-36 flex-col justify-end rounded-lg bg-gray-50 p-3 shadow xl:min-h-40">
        <div className="relative h-12 w-4/5 xl:h-14">
          <Image
            src="/assets/pmi_logo.webp"
            alt="PMI"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={100}
            priority
          />
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

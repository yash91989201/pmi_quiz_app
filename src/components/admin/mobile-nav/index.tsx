import Image from "next/image";
// CUSTOM COMPONENTS
import SideBar from "@/components/admin/mobile-nav/side-bar";

export default function MobileNav() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white p-3 shadow-md lg:hidden">
      <div className="relative h-10 w-36">
        <Image
          src="/assets/pmi_logo.webp"
          alt="PMI"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <SideBar />
    </header>
  );
}

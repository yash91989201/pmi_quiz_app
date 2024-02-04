// CUSTOM COMPONENTS
import SideBar from "@/components/admin/mobile-nav/side-bar";
import Image from "next/image";

export default function MobileNav() {
  return (
    <header className="sticky top-0 z-20 flex  justify-between bg-white p-3 shadow-md lg:hidden">
      <div className="relative h-10 w-36">
        <Image src="/assets/pmi_logo.webp" alt="PMI" fill />
      </div>
      <SideBar />
    </header>
  );
}

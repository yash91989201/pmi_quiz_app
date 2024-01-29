// CUSTOM COMPONENTS
import SideBar from "@/components/admin/mobile-nav/side-bar";

export default function MobileNav() {
  return (
    <header className="sticky top-0 z-20 flex  justify-between bg-white p-6 shadow-md lg:hidden">
      <h2>PMI</h2>
      <SideBar />
    </header>
  );
}

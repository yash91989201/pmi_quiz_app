// CUSTOM COMPONENTS
import SideBar from "@/components/admin/mobile-nav/side-bar";

export default function MobileNav() {
  return (
    <header className="sticky top-0 flex justify-between  p-6 shadow-md lg:hidden">
      <h2>PMI</h2>
      <SideBar />
    </header>
  );
}

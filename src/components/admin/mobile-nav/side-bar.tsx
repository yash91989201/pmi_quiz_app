// CUSTOM COMPONENTS
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavLink from "@/components/admin/side-nav/nav-link";
import LogoutButton from "@/components/admin/side-nav/logout-button";
// ICONS
import { Menu } from "lucide-react";
// CONSTANTS
import { ADMIN_NAV_LINKS } from "@/config/routes";

export default function SideBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent className="h-full">
        <SheetHeader>
          <SheetTitle>PMI</SheetTitle>
        </SheetHeader>
        <section className="flex h-full flex-col py-6">
          <nav className="flex flex-1 flex-col gap-3">
            {ADMIN_NAV_LINKS.map(({ href, label, matchExact }, index) => (
              <NavLink
                key={index}
                href={href}
                label={label}
                matchExact={matchExact}
              />
            ))}
          </nav>
          <LogoutButton />
        </section>
      </SheetContent>
    </Sheet>
  );
}

// CUSTOM COMPONENTS
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLink from "@/components/admin/side-nav/nav-link";
// ICONS
import { Menu } from "lucide-react";
// CONSTANTS
import { USER_NAV_LINKS } from "@/config/routes";

export default function UserSideBar() {
  return (
    <Sheet>
      <SheetTrigger className="sm:hidden" asChild>
        <Menu />
      </SheetTrigger>
      <SheetContent className="h-full">
        <section className="flex h-full flex-col py-6">
          <nav className="flex flex-1 flex-col gap-3">
            {USER_NAV_LINKS.map(({ href, label, matchExact }, index) => (
              <NavLink
                key={index}
                href={href}
                label={label}
                matchExact={matchExact}
              />
            ))}
          </nav>
        </section>
      </SheetContent>
    </Sheet>
  );
}

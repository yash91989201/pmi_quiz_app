// CUSTOM COMPONENTS
import NavLink from "@/components/admin/side-nav/nav-link";
// CONSTANTS
import { NAV_LINKS } from "@/config/routes";

export default function NavLinks() {
  return (
    <>
      {NAV_LINKS.map(({ href, label, matchExact }, index) => (
        <NavLink
          key={index}
          href={href}
          label={label}
          matchExact={matchExact}
        />
      ))}
    </>
  );
}

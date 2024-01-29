// CUSTOM COMPONENTS
import NavLink from "@/components/user/nav-link";
// CONSTANTS
import { USER_NAV_LINKS } from "@/config/routes";

export default function NavLinks() {
  return (
    <>
      {USER_NAV_LINKS.map(({ href, label, matchExact }, index) => (
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

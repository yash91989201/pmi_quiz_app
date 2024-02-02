import Image from "next/image";
// ACTIONS
import { logoutUser } from "@/server/actions/user";
// CUSTOM COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavLinks from "@/components/user/nav-links";
import { currentUser } from "@/server/utils/auth";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

export default async function UserNavbar() {
  const user = await currentUser();

  return (
    <header className="w-full shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-3">
        <div className="relative h-14 w-56">
          <Image src="/assets/pmi_logo.webp" alt="PMI" fill />
        </div>
        <div className="flex gap-3">
          <nav className="space-x-3">
            <NavLinks />
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/profile"
                  className="flex w-full items-center gap-2"
                >
                  <UserRound className="size-4 text-gray-800" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <form action={logoutUser} className="w-full">
                  <button className="flex w-full items-center gap-2">
                    <LogOut className="size-4 text-gray-800" />
                    <span>Log Out</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import UserTable from "@/components/admin/user/user-table";
import URLSearchBox from "@/components/shared/url-search-box";
import { Plus } from "lucide-react";

export default function UsersPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">All Users</h2>
      <div className="flex gap-3">
        <URLSearchBox />
        <Link
          href="/admin/users/create-new-user"
          className={cn(
            buttonVariants(),
            "flex w-fit items-center gap-2 md:h-full md:text-lg",
          )}
        >
          <Plus className="size-6 md:size-5" />
          <span className="hidden sm:block">New User</span>
        </Link>
      </div>

      <UserTable searchParams={searchParams} />
    </div>
  );
}

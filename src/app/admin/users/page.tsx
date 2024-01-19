import UserTable from "@/components/admin/user/user-table";
import URLSearchBox from "@/components/shared/url-search-box";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function UsersPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base  md:text-3xl">Users</h2>
      <div className="flex gap-3 ">
        <URLSearchBox />
        <Link
          href="/admin/users/create-new-user"
          className={cn(buttonVariants({ className: "w-24" }))}
        >
          New User
        </Link>
      </div>

      <UserTable searchParams={searchParams} />
    </div>
  );
}

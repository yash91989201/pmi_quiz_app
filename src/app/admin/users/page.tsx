import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import UserTable from "@/components/admin/user/user-table";
import URLSearchBox from "@/components/shared/url-search-box";

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
          href="/admin/quizzes/create-new-user"
          className={cn(buttonVariants(), "h-full w-36 md:text-lg")}
        >
          New User
        </Link>
      </div>

      <UserTable searchParams={searchParams} />
    </div>
  );
}

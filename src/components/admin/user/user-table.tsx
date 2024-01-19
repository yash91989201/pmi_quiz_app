import PaginationWtihEllepsis from "@/components/shared/pagination-with-ellepsis";
import RowsPerPage from "@/components/shared/rows-per-page";
import DataTable from "@/components/ui/data-table";
import { userTableColumns } from "@/config/data-table-column-defs";
import type { UserSchemaType } from "@/lib/schema";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function UserTable({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  const customerSearchQuery = searchParams?.query ?? "";
  const page = Number(searchParams?.page ?? "1");
  const per_page = Number(searchParams?.per_page ?? "5");

  const { users, hasNextPage, hasPreviousPage, total_page } =
    await api.user.getAll.query({
      query: customerSearchQuery,
      page: Number(page),
      per_page: Number(per_page),
    });

  if (page > total_page && users.length !== 0)
    redirect(`?page=${total_page}&per_page=${per_page}`);

  return (
    <>
      <DataTable columns={userTableColumns} data={users as UserSchemaType[]} />

      <div className="flex flex-col-reverse items-center gap-6 lg:flex-row lg:justify-end lg:gap-12 ">
        {users?.length !== 0 && <RowsPerPage per_page={per_page} />}
        {total_page > 1 && (
          <PaginationWtihEllepsis
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            total_page={total_page}
          />
        )}
      </div>
    </>
  );
}

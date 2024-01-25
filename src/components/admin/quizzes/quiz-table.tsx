import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
// TYPES
import type { QuizTableSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
import RowsPerPage from "@/components/shared/rows-per-page";
import { quizTableColumns } from "@/config/data-table-column-defs";
import PaginationWtihEllepsis from "@/components/shared/pagination-with-ellepsis";

export default async function QuizTable({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  const customerSearchQuery = searchParams?.query ?? "";
  const page = Number(searchParams?.page ?? "1");
  const per_page = Number(searchParams?.per_page ?? "5");

  const { quizzes, hasNextPage, hasPreviousPage, total_page } =
    await api.quiz.getAll.query({
      query: customerSearchQuery,
      page: Number(page),
      per_page: Number(per_page),
    });

  if (page > total_page && quizzes.length !== 0)
    redirect(`?page=${total_page}&per_page=${per_page}`);

  return (
    <>
      <DataTable
        columns={quizTableColumns}
        data={quizzes as QuizTableSchemaType[]}
      />

      <div className="flex flex-col-reverse items-center gap-6 lg:flex-row lg:justify-end lg:gap-12 ">
        {quizzes?.length !== 0 && <RowsPerPage per_page={per_page} />}
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

// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
// CONSTANTS
import { usersQuizzesTableColumns } from "@/config/data-table-column-defs";

export default async function Page({ params }: { params: { quizId: string } }) {
  const data = await api.quiz.getUsersQuizzes.query({ quizId: params.quizId });
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">{data[0]?.quizTitle} results</h2>
      <DataTable columns={usersQuizzesTableColumns} data={data} />
    </section>
  );
}

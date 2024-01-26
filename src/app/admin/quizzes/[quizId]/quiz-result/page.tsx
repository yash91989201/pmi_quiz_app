// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
import { usersQuizzesTableColumns } from "@/config/data-table-column-defs";

export default async function Page({ params }: { params: { quizId: string } }) {
  const data = await api.quiz.getUsersQuizzes.query({ quizId: params.quizId });
  return (
    <>
      <h2 className="text-base  md:text-3xl">Quiz Results</h2>
      <DataTable columns={usersQuizzesTableColumns} data={data} />
    </>
  );
}

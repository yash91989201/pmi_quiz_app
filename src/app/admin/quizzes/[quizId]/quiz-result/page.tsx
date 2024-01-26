// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
import { usersQuizzesTableColumns } from "@/config/data-table-column-defs";

export default async function Page({ params }: { params: { quizId: string } }) {
  const data = await api.quiz.getUsersQuizzes.query({ quizId: params.quizId });
  return (
    <>
      <h3 className="text-base  md:text-xl">Quiz Results</h3>
      <DataTable columns={usersQuizzesTableColumns} data={data} />
    </>
  );
}

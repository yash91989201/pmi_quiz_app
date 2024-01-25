// UTILS
import { api } from "@/trpc/server";
import { getUserById } from "@/server/utils/user";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
// CONSTANTS
import { userQuizzesTableColumns } from "@/config/data-table-column-defs";

export default async function Page({ params }: { params: { userId: string } }) {
  const currentUser = await getUserById(params.userId);
  const data = await api.quiz.getUserQuizzes.query({ userId: params.userId });
  return (
    <section className="flex flex-col gap-3">
      <p>Viewing Quizzes for: {currentUser?.name}</p>
      <DataTable columns={userQuizzesTableColumns} data={data} />
    </section>
  );
}

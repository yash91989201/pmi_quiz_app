// UTILS
import { api } from "@/trpc/server";
import { getUserById } from "@/server/utils/user";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
import { userQuizzesTableColumnsForAdmin } from "@/config/data-table-column-defs";

export default async function Page({ params }: { params: { userId: string } }) {
  const currentUser = await getUserById(params.userId);
  const data = await api.quiz.getUserQuizzes.query({ userId: params.userId });
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">
        {currentUser?.name}&apos;s Quizzes
      </h2>
      <DataTable columns={userQuizzesTableColumnsForAdmin} data={data} />
    </section>
  );
}

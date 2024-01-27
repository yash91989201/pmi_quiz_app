import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
import { currentUser } from "@/server/utils/auth";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
import LogoutButton from "@/components/admin/side-nav/logout-button";
import { userQuizzesTableColumnsForUser } from "@/config/data-table-column-defs";

export default async function QuizzesPage() {
  const user = await currentUser();
  if (!user) redirect("/auth/login");

  const userQuizzes = await api.user.getQuizzes.query();

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-xl font-medium">Available Quizzes</h3>
        <DataTable
          columns={userQuizzesTableColumnsForUser}
          data={userQuizzes}
        />
      </div>
      <LogoutButton />
    </>
  );
}

"use client";
import { redirect } from "next/navigation";
// CUSTOM HOOKS
import { useCurrentUser } from "@/hooks/use-current-user";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { UserQuizStatusType } from "@/lib/schema";
// CUSTOM COMPONENTS
import LogoutButton from "@/components/admin/side-nav/logout-button";
import { userQuizzesTableColumnsForUser } from "@/config/data-table-column-defs";
// CONSTANTS
import DataTable from "@/components/ui/data-table";

type UserQuizType = {
  userQuizId: string;
  userId: string;
  quizId: string;
  quizTitle: string | null;
  totalMark: number | null;
  score: number;
  status: UserQuizStatusType;
};

export default function QuizzesPage() {
  const user = useCurrentUser();
  if (!user) redirect("/auth/login");

  const { data } = api.user.getQuizzes.useQuery();
  const userQuizzes: UserQuizType[] = data ?? [];

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

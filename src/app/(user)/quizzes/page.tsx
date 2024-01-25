"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
// CUSTOM HOOKS
import { useCurrentUser } from "@/hooks/use-current-user";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { UserQuizStatusType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/admin/side-nav/logout-button";
// CONSTANTS
import { STATUS_TEXT } from "@/config/constants";

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
        <div className="flex flex-col gap-1">
          {userQuizzes.length > 0 &&
            userQuizzes.map((userQuiz) => (
              <QuizCard key={userQuiz.userQuizId} userQuiz={userQuiz} />
            ))}
        </div>
      </div>
      <LogoutButton />
    </>
  );
}

function QuizCard({ userQuiz }: { userQuiz: UserQuizType }) {
  return (
    <div className="flex w-full gap-3 bg-primary/10 p-3 ">
      <p>{userQuiz.quizTitle}</p>
      <p>{userQuiz.score}</p>
      <p>{STATUS_TEXT[userQuiz.status]}</p>
      <p>{userQuiz.totalMark}</p>
      <Button variant="ghost" disabled={userQuiz.status !== "NOT_STARTED"}>
        <Link href={`/quizzes/${userQuiz.userQuizId}`}>Start Quiz</Link>
      </Button>
    </div>
  );
}

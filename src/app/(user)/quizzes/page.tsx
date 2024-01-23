"use client";

import LogoutButton from "@/components/admin/side-nav/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { UserQuizStatusType } from "@/lib/schema";
import { api } from "@/trpc/react";
import Link from "next/link";
import { redirect } from "next/navigation";

type UserQuizType = {
  userQuizId: string;
  userId: string;
  quizId: string;
  quizTitle: string | null;
  totalMark: number | null;
  score: number;
  status: UserQuizStatusType;
};

const STATUS_TEXT = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

export default function QuizzesPage() {
  const user = useCurrentUser();
  if (!user) redirect("/auth/login");

  const { data } = api.quiz.getUserQuizzes.useQuery({ userId: user.id });
  const userQuizzes: UserQuizType[] = data ?? [];
  console.log(data);
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
      <Link href={`/quizzes/${userQuiz.quizId}`}>Start Quiz</Link>
    </div>
  );
}

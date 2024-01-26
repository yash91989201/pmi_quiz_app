import type { ReactNode } from "react";
// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import QuizPageBreadcrumbs from "@/components/admin/quizzes/quiz-page-breadcrumbs";

export default async function QuizLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { quizId: string };
}) {
  const data = await api.quiz.getQuizData.query({
    quizId: params.quizId,
  });
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">{data.quizTitle}</h2>
      <QuizPageBreadcrumbs quizId={data.quizId} quizTitle={data.quizTitle} />
      {children}
    </section>
  );
}

import type { ReactNode } from "react";
// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import QuizPageBreadcrumb from "@/components/admin/quizzes/quiz-page-breadcrumb";

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
      <h3 className="text-base  md:text-3xl">{data.quizTitle}</h3>
      <QuizPageBreadcrumb quizId={data.quizId} quizTitle={data.quizTitle} />
      {children}
    </section>
  );
}

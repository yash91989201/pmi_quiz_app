import UpdateQuizForm from "@/components/admin/quizzes/update-quiz-form";
import { api } from "@/trpc/server";

export default async function EditQuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const quizData = await api.quiz.getQuizData.query({ quizId: params.quizId });

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">Editing {quizData.quizTitle}</h2>
      <UpdateQuizForm defaultValues={quizData} />
    </section>
  );
}

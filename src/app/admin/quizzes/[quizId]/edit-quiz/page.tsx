import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import UpdateQuizForm from "@/components/admin/quizzes/update-quiz-form";

export default async function EditQuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const quizData = await api.quiz.getQuizData.query({ quizId: params.quizId });

  return (
    <>
      <h3 className="text-base  md:text-xl">Edit Quiz</h3>
      <UpdateQuizForm defaultValues={quizData} />
    </>
  );
}

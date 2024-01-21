// CUSTOM COMPONENTS
import QuizForm from "@/components/admin/quizzes/quiz-form";

export default function CreateNewQuiz() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base  md:text-3xl">Create New Quiz</h2>
      <QuizForm />
    </div>
  );
}

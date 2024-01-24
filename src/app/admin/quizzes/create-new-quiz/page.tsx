// CUSTOM COMPONENTS
import CreateQuizForm from "@/components/admin/quizzes/create-quiz-form";

export default function CreateNewQuiz() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base  md:text-3xl">Create New Quiz</h2>
      <CreateQuizForm />
    </div>
  );
}

// CUSTOM COMPONENTS
import CreateQuizForm from "@/components/admin/quizzes/create-quiz-form";

export default function CreateNewQuiz() {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base  md:text-3xl">Create New Exam</h3>
      <CreateQuizForm />
    </div>
  );
}

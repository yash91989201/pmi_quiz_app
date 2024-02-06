// UTILS
import { api } from "@/trpc/server";
// ICONS
import QuizCard from "@/components/user/quiz-card";

export default async function QuizzesPage() {
  const pendingUserQuizzes = await api.user.getPendingQuizzes.query();
  const completedUserQuizzes = await api.user.getCompletedQuizzes.query();

  return (
    <div className="flex flex-col gap-6">
      {pendingUserQuizzes.length > 0 ? (
        <div className="flex flex-col gap-6">
          <h3 className="rounded-md bg-primary  p-3 text-base font-medium text-white md:text-3xl">
            Available Exams
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {pendingUserQuizzes.map((userQuiz) => (
              <QuizCard key={userQuiz.userQuizId} userQuiz={userQuiz} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <h3 className="rounded-md bg-primary  p-3 text-base font-medium text-white md:text-3xl">
            Available Exams
          </h3>
          <p>No exams available</p>
        </div>
      )}
      {completedUserQuizzes.length > 0 && (
        <div className="flex flex-col gap-6">
          <h3 className="rounded-md bg-primary  p-3 text-base font-medium text-white md:text-3xl">
            Completed Exams
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {completedUserQuizzes.map((userQuiz) => (
              <QuizCard key={userQuiz.userQuizId} userQuiz={userQuiz} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

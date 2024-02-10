// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import QuizCard from "@/components/user/quiz-card";
import RefreshOnFocus from "@/components/shared/refresh-on-focus";

export default async function QuizzesPage() {
  const pendingUserQuizzes = await api.user.getPendingQuizzes.query();
  const completedUserQuizzes = await api.user.getCompletedQuizzes.query();

  return (
    <>
      <RefreshOnFocus />
      <div className="flex flex-col gap-6">
        {pendingUserQuizzes.length > 0 ? (
          <div className="flex flex-col gap-6">
            <h3 className="rounded-md bg-primary p-3 text-lg font-medium text-white md:text-2xl">
              Available Exams
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {pendingUserQuizzes.map((userQuiz) => (
                <QuizCard key={userQuiz.userQuizId} userQuiz={userQuiz} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h3 className="rounded-md bg-primary  p-3 text-lg font-medium text-white md:text-2xl">
              Available Exams
            </h3>
            <p className="text-lg font-medium">No exams available</p>
          </div>
        )}
        {completedUserQuizzes.length > 0 && (
          <div className="flex flex-col gap-6">
            <h3 className="rounded-md bg-primary p-3 text-lg font-medium text-white md:text-2xl">
              Completed Exams
            </h3>
            <div className="grid grid-cols-1  gap-6 md:grid-cols-2">
              {completedUserQuizzes.map((userQuiz) => (
                <QuizCard key={userQuiz.userQuizId} userQuiz={userQuiz} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

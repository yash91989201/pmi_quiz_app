// UTILS
import { api } from "@/trpc/server";
// ICONS
import QuizCard from "@/components/user/quiz-card";
import UserOrders from "@/components/shared/user-orders";

export default async function QuizzesPage() {
  const pendingUserQuizzes = await api.user.getPendingQuizzes.query();
  const completedUserQuizzes = await api.user.getCompletedQuizzes.query();
  const userOrders = await api.user.getUserOrdersOnUser.query();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h3 className="rounded-md bg-primary  p-3 text-base font-medium text-white md:text-3xl">
          Your Order
        </h3>
        <UserOrders userOrders={userOrders} />
      </div>
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

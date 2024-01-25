// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import UserQuizForm from "@/components/user/user-quiz-form";

export default async function Page({
  params,
}: {
  params: { userQuizId: string };
}) {
  const userQuizData = await api.quiz.getUserQuizData.query({
    userQuizId: params.userQuizId,
  });

  return (
    <div className="mx-16 space-y-3">
      <div className="flex">
        <p className="text-xl">{userQuizData.quizTitle}</p>
        <p>{userQuizData.totalMark}</p>
      </div>
      <div className="space-y-3">
        {userQuizData.questions.length > 0 && (
          <UserQuizForm
            quizId={userQuizData.quizId}
            userQuizId={userQuizData.userQuizId}
            questions={userQuizData.questions}
          />
        )}
      </div>
    </div>
  );
}

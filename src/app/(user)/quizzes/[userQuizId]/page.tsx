// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import { Badge } from "@/components/ui/badge";
import UserQuizForm from "@/components/user/user-quiz-form";

export default async function Page({
  params,
}: {
  params: { userQuizId: string };
}) {
  const userQuizData = await api.user.getQuizData.query({
    userQuizId: params.userQuizId,
  });

  return (
    <div className="mx-auto my-12 mt-8 flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold md:text-2xl">{userQuizData.quizTitle}</h3>
        <Badge variant="outline" className="w-fit">
          Total Mark:&nbsp;{userQuizData.totalMark}
        </Badge>
      </div>
      <UserQuizForm
        quizId={userQuizData.quizId}
        userQuizId={userQuizData.userQuizId}
        questions={userQuizData.questions}
      />
    </div>
  );
}

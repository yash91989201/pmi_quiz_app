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
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <div className="h-3 bg-primary" />
        <div className="flex h-44 items-center justify-between gap-8 p-6">
          <h3 className="font-semibold md:text-2xl">
            {userQuizData.quizTitle}
          </h3>
          <Badge className="w-fit">
            Total Mark:&nbsp;{userQuizData.totalMark}
          </Badge>
        </div>
      </div>
      <UserQuizForm
        quizId={userQuizData.quizId}
        userQuizId={userQuizData.userQuizId}
        questions={userQuizData.questions}
      />
    </div>
  );
}

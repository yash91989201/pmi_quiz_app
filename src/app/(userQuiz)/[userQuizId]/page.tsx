"use client";
import { useEffect } from "react";
// UTILS
import { api } from "@/trpc/react";
// CUSTOM COMPONENTS
import { Badge } from "@/components/ui/badge";
import UserQuizForm from "@/components/user/user-quiz-form";
// ICONS
import { Info } from "lucide-react";

export default function UserQuizPage({
  params,
}: {
  params: { userQuizId: string };
}) {
  const { mutate: leaveQuiz } = api.user.leaveQuiz.useMutation();
  const { data: userQuizData, isLoading } = api.user.getQuizData.useQuery({
    userQuizId: params.userQuizId,
  });

  useEffect(() => {
    function handleQuizLeave() {
      leaveQuiz({ userQuizId: params.userQuizId });
    }

    window.addEventListener("beforeunload", handleQuizLeave);
    return () => {
      window.removeEventListener("beforeunload", handleQuizLeave);
    };
  }, [leaveQuiz, params.userQuizId]);

  if (userQuizData === undefined || isLoading)
    return (
      <div className="mx-auto my-12 mt-8 flex max-w-3xl flex-col gap-6">
        <div className="overflow-hidden rounded-lg border bg-white shadow">
          <div className="h-3 bg-primary" />
          <div className="flex h-44 items-center justify-between gap-8 p-6">
            <h3 className="font-semibold md:text-2xl">Starting Exam</h3>
          </div>
        </div>
      </div>
    );

  if (userQuizData.status === "COMPLETED") window.close();

  return (
    <div className="mx-auto my-12 mt-8 flex w-11/12 flex-col gap-6 sm:w-4/5 md:max-w-3xl">
      <div className="overflow-hidden rounded-lg border bg-white shadow">
        <div className="h-3 bg-primary" />
        <div className="flex h-24 items-center justify-between gap-8 p-6">
          <h3 className="font-semibold md:text-2xl">
            {userQuizData.quizTitle}
          </h3>
          <Badge className="w-fit">
            Total Mark:&nbsp;{userQuizData.totalMark}
          </Badge>
        </div>
        <div className="p-6 font-semibold text-red-500">
          <p className="mb-2 inline-flex items-center gap-3">
            <span className="text-medium font-semibold md:text-lg">Note</span>
            <Info size={18} />
          </p>
          <p>
            Please don&apos;t close or refresh this tab. If you do, your exam
            will end with a score of 0, and you won&apos;t be able to retake it.
          </p>
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

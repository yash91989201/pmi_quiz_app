"use client";
import Image from "next/image";
import Link from "next/link";
// UTILS
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, getRandomizedPatternPath, renderOnClient } from "@/lib/utils";
// CUSTOM COMPONENTS
import { Card, CardContent, CardFooter } from "@/components/ui/card";
// ICONS
import { ArrowBigRight, Download, Loader2 } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StartUserQuizFormSchema,
  type StartUserQuizFormSchemaType,
} from "@/lib/schema";
import { startUserQuiz } from "@/server/actions/user";
import { toast } from "sonner";

function QuizCard({
  userQuiz,
}: {
  userQuiz: {
    userQuizId: string;
    userId: string;
    quizId: string;
    score: number;
    status: UserQuizStatus;
    quizTitle: string | null;
    totalMark: number | null;
    certificateId: string | null;
  };
}) {
  const startUserQuizForm = useForm<StartUserQuizFormSchemaType>({
    defaultValues: { userQuizId: userQuiz.userQuizId },
    resolver: zodResolver(StartUserQuizFormSchema),
  });
  const { handleSubmit, formState } = startUserQuizForm;

  const startUserQuizFormAction: SubmitHandler<
    StartUserQuizFormSchemaType
  > = async (data) => {
    const actionResponse = await startUserQuiz(data);
    if (actionResponse.status === "SUCCESS") {
      toast.success(actionResponse.message);
      const link = document.createElement("a");
      link.href = `/${userQuiz.userQuizId}`;
      link.style.visibility = "hidden";
      link.target = "_blank";
      link.click();
      document.body.appendChild(link);
    } else {
      toast.error(actionResponse.message);
    }
  };

  return (
    <Card
      key={userQuiz.userQuizId}
      className="duration-150 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
    >
      <CardContent className="relative h-64 overflow-hidden p-0">
        <Image
          src={getRandomizedPatternPath()!}
          alt="random background pattern"
          fill
        />
      </CardContent>
      <CardFooter className="justify-between p-6">
        <p className="w-fit text-lg font-semibold md:text-2xl">
          {userQuiz.quizTitle}
        </p>
        {userQuiz.status === "NOT_STARTED" && (
          <form onSubmit={handleSubmit(startUserQuizFormAction)}>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-full bg-green-500 text-white hover:text-green-500"
            >
              <span className="font-semibold md:text-lg">Start Exam</span>
              {formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowBigRight />
              )}
            </Button>
          </form>
        )}
        {userQuiz.status === "COMPLETED" && (
          <Link
            href={`https://drive.usercontent.google.com/download?id=${userQuiz.certificateId}&export=download`}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "flex items-center gap-3 rounded-full text-white",
              userQuiz.certificateId === null &&
                "pointer-events-none bg-red-500/75",
            )}
          >
            <span className="font-semibold md:text-lg">Certificate</span>
            <Download size={18} />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export default renderOnClient(QuizCard);

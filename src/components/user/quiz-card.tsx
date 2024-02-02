"use client";
import Image from "next/image";
import Link from "next/link";
// UTILS
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, getRandomizedPatternPath } from "@/lib/utils";
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
import { useRouter } from "next/navigation";

export default function QuizCard({
  userQuiz,
}: {
  userQuiz: {
    userQuizId: string;
    userId: string;
    quizId: string;
    score: number;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    quizTitle: string | null;
    totalMark: number | null;
  };
}) {
  const router = useRouter();
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
      router.push(`/quizzes/${userQuiz.userQuizId}`);
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
              className="flex h-12 items-center gap-3 rounded-full bg-green-500 text-white"
            >
              <span className="text-xl font-semibold">Start Exam</span>
              {formState.isSubmitting ? <Loader2 /> : <ArrowBigRight />}
            </Button>
          </form>
        )}
        {userQuiz.status === "COMPLETED" && (
          <Link
            href={`/certificates/${userQuiz.userQuizId}`}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "flex h-12 items-center gap-3 rounded-full text-white",
            )}
          >
            <span className="text-xl font-semibold">Download Certificate</span>
            <Download />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

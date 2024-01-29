import parse from "html-react-parser";
// UTILS
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/server";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { DeleteQuizButton } from "@/components/admin/quizzes/delete-quiz-button";

export default async function Page({ params }: { params: { quizId: string } }) {
  const data = await api.quiz.getQuizData.query({ quizId: params.quizId });
  const totalQuestions = data.questions.length;
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-base  md:text-xl">Quiz Actions</h3>
        <div className="flex gap-3">
          <Link
            href={`/admin/quizzes/${data.quizId}/edit-quiz`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "flex items-center gap-3  [&>svg]:size-3",
            )}
          >
            <Edit2 />
            <span>Edit Quiz</span>
          </Link>
          <DeleteQuizButton quizId={data.quizId} />
        </div>
      </div>
      <h3 className="text-base md:text-xl">Questions</h3>
      {data.questions.map(
        ({ mark, options, questionText, questionId }, index) => (
          <Card key={questionId}>
            <CardHeader className="justify-start gap-3 p-3 md:flex-row md:p-6">
              <div>
                <span className="text-xl font-bold text-primary">
                  {index + 1}
                </span>
                <span>/{totalQuestions}</span>
              </div>
              <section className="flex-1">{parse(questionText)}</section>
              <Badge variant="outline" className="w-fit">
                Mark:&nbsp;{mark}
              </Badge>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <div className="flex  flex-col  gap-1">
                {options.map(({ optionId, optionText, isCorrectOption }) => (
                  <p
                    key={optionId}
                    className={cn(
                      "rounded-md  p-2 lg:p-3",
                      isCorrectOption
                        ? "bg-green-500 text-white"
                        : "border bg-white",
                    )}
                  >
                    {optionText}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ),
      )}
    </section>
  );
}

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
      <div className="flex items-center justify-end gap-3">
        <Link
          href={`/admin/quizzes/${data.quizId}/edit-quiz`}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "flex items-center gap-3 bg-blue-500 text-white hover:bg-blue-500/90 [&>svg]:size-4",
          )}
        >
          <Edit2 />
          <span>Edit Quiz</span>
        </Link>
        <DeleteQuizButton quizId={data.quizId} />
      </div>
      <h2 className="text-base md:text-xl">Questions</h2>
      {data.questions.map(
        ({ mark, options, questionText, questionId }, index) => (
          <Card key={questionId}>
            <CardHeader className="justify-start gap-3 md:flex-row">
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
            <CardContent>
              <div className="flex min-w-[480px] flex-col  gap-1">
                {options.map(({ optionId, optionText, isCorrectOption }) => (
                  <p
                    key={optionId}
                    className={cn(
                      "rounded-md  p-2 lg:p-3",
                      isCorrectOption
                        ? "bg-primary text-white"
                        : "bg-primary/20",
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

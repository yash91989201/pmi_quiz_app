import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DeleteQuizButton } from "@/components/admin/quizzes/delete-quiz-button";
// ICONS
import { Edit2 } from "lucide-react";

export default async function Page({ params }: { params: { quizId: string } }) {
  const data = await api.quiz.getQuizData.query({ quizId: params.quizId });
  const totalQuestions = data.questions.length;
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-base  md:text-xl">Exam Actions</h3>
        <div className="flex gap-3">
          <Link
            href={`/admin/quizzes/${data.quizId}/edit-quiz`}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "flex items-center gap-3  [&>svg]:size-3",
            )}
          >
            <Edit2 />
            <span>Edit Exam</span>
          </Link>
          <DeleteQuizButton quizId={data.quizId} />
        </div>
      </div>
      <h3 className="text-base md:text-xl">Questions</h3>
      {data.questions.map(
        (
          { mark, options, questionText, questionId, questionImageId },
          index,
        ) => (
          <Card key={questionId}>
            <CardHeader className="justify-start gap-3 p-3 md:flex-row md:p-6">
              <div>
                <span className="text-xl font-bold text-primary">
                  {index + 1}
                </span>
                <span>/{totalQuestions}</span>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {(questionImageId ?? "").length > 0 && (
                  <div className="relative h-48 w-4/5 sm:h-52 sm:w-96">
                    <Image
                      src={`https://drive.google.com/uc?export=view&id=${questionImageId}`}
                      alt="PMI"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <section>{parse(questionText)}</section>
              </div>
              <Badge variant="outline" className="h-fit w-fit">
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

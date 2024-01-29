// UTILS
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { STATUS_TEXT } from "@/config/constants";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import Link from "next/link";
// CUSTOM COMPONENTS

export default async function QuizzesPage() {
  const userQuizzes = await api.user.getQuizzes.query();

  return (
    <>
      <div className="flex flex-col gap-6">
        <h3 className="text-base font-medium md:text-3xl">Available Exams</h3>
        <div className="grid grid-cols-2 gap-3">
          {userQuizzes.map((userQuiz) => (
            <Card key={userQuiz.userQuizId}>
              <CardHeader className="text-xl font-semibold">
                {userQuiz.quizTitle}
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">Score: {userQuiz.score}</p>
              </CardContent>
              <CardFooter className="justify-between">
                {userQuiz.status === "NOT_STARTED" && (
                  <>
                    <Badge className="bg-warning text-lg ">
                      {STATUS_TEXT[userQuiz.status]}
                    </Badge>
                    <Link
                      href={`/quizzes/${userQuiz.userQuizId}`}
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        " text-gray-700",
                      )}
                    >
                      Start Quiz
                    </Link>
                  </>
                )}

                {userQuiz.status === "COMPLETED" && (
                  <>
                    <Badge className="bg-success text-lg ">
                      {STATUS_TEXT[userQuiz.status]}
                    </Badge>
                    <Link
                      href={`/quizzes/${userQuiz.userQuizId}`}
                      className={cn(
                        buttonVariants({ variant: "destructive" }),
                        " text-white",
                      )}
                    >
                      Download Certificate
                    </Link>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

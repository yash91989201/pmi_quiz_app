"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { api } from "@/trpc/react";

type QuestionType = {
  quizId: string;
  questionId: string;
  questionText: string;
  mark: number;
  options: {
    questionId: string;
    optionId: string;
    optionText: string;
  }[];
};

export default function Page({ params }: { params: { quizId: string } }) {
  const { data } = api.quiz.getQuizQuestionsAndOptions.useQuery({
    quizId: params.quizId,
  });

  const questions: QuestionType[] = data ?? [];

  return (
    <div className="mx-16 space-y-3">
      <p className="text-xl">Javascript Quiz</p>
      <div className="space-y-3">
        {questions.length > 0 &&
          questions.map((question, index) => (
            <Question
              key={question.questionId}
              index={index}
              question={question}
              totalQuestions={questions.length}
            />
          ))}
      </div>
    </div>
  );
}

function Question({
  question,
  index,
  totalQuestions,
}: {
  question: QuestionType;
  index: number;
  totalQuestions: number;
}) {
  return (
    <Card className="max-w-[640px]">
      <CardHeader className="flex">
        <div>
          <span className="text-xl font-bold text-primary">{index + 1}</span>
          <span>/{totalQuestions}</span>
        </div>
        <p>{question.questionText}</p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-1">
          {question.options.map((option) => (
            <div key={option.optionId} className="rounded-lg bg-primary/15 p-3">
              {option.optionText}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

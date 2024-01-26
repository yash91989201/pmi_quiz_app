"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// ACTIONS
import { createQuiz } from "@/server/actions/quiz";
// UTILS
import { api } from "@/trpc/react";
// SCHEMAS
import { QuizFormSchema } from "@/lib/schema";
// TYPES
import type { QuizFormSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuestionsField from "@/components/admin/quizzes/quiz-form-fields/questions-field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import AvailableUsersField from "@/components/admin/quizzes/quiz-form-fields/available-users-field";
// ICONS
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function CreateQuizForm() {
  const quizId = createId();
  const initialQuestionId = createId();
  const { data, isLoading } = api.user.getUsersId.useQuery();
  const availableUsers = data ?? [];

  const [actionResponse, setActionResponse] = useState<QuizFormStatusType>();
  const router = useRouter();

  const defaultValues: QuizFormSchemaType = {
    quizId,
    quizTitle: "Javascript Quiz",
    totalMark: 5,
    usersId: [],
    questions: [
      {
        questionId: initialQuestionId,
        quizId,
        questionText: "What is hoisting ?",
        mark: 5,
        options: [
          {
            optionId: createId(),
            questionId: initialQuestionId,
            optionText: "block scope",
            isCorrectOption: true,
          },
          {
            optionId: createId(),
            questionId: initialQuestionId,
            optionText: "global scope",
            isCorrectOption: false,
          },
        ],
      },
    ],
  };

  const quizForm = useForm<QuizFormSchemaType>({
    defaultValues,
    resolver: zodResolver(QuizFormSchema),
    shouldUseNativeValidation: true,
  });

  const { handleSubmit, formState, reset, watch, getValues } = quizForm;

  const createQuizAction: SubmitHandler<QuizFormSchemaType> = async (data) => {
    const totalMark = getValues("questions")
      .map((question) => question.mark)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const actionResponse = await createQuiz({
      ...data,
      totalMark,
    });
    setActionResponse(actionResponse);
    if (actionResponse.status === "SUCCESS") {
      reset();
      setTimeout(() => {
        router.replace("/admin/quizzes");
      }, 1500);
    }
  };

  const totalMark = watch("questions")
    .map((question) => question.mark)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (
    <Form {...quizForm}>
      <form
        className="flex max-w-[1024] flex-col gap-3"
        onSubmit={handleSubmit(createQuizAction)}
      >
        <FormField
          name="quizTitle"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Quiz Name" type="text" />
                </FormControl>
              </FormItem>
            </div>
          )}
        />

        <div className="flex gap-2">
          <span>Total Marks: </span>
          <span>{totalMark}</span>
        </div>
        <QuestionsField />

        <AvailableUsersField
          isLoading={isLoading}
          availableUsers={availableUsers}
        />

        {actionResponse?.status === "SUCCESS" && (
          <div className="flex items-center justify-start gap-2 rounded-md bg-green-100 p-3 text-sm text-green-600 [&>svg]:size-4">
            <CheckCircle2 />
            <p>{actionResponse.message}</p>
          </div>
        )}

        {actionResponse?.status === "FAILED" && (
          <div className="flex items-center justify-start gap-3 rounded-md bg-red-100 p-3 text-sm text-red-600 [&>svg]:size-4">
            <XCircle />
            <p>{actionResponse.message}</p>
          </div>
        )}
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="flex w-fit items-center justify-center gap-3 self-end disabled:cursor-not-allowed"
        >
          <h6 className="md:text-lg">Create Quiz</h6>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}

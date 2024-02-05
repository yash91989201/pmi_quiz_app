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
import { Badge } from "@/components/ui/badge";

export default function CreateQuizForm() {
  const quizId = createId();
  const initialQuestionId = createId();
  const { data, isLoading } = api.user.getAllUsers.useQuery();
  const availableUsers = data ?? [];

  const [actionResponse, setActionResponse] = useState<QuizFormStatusType>();
  const router = useRouter();

  const defaultValues: QuizFormSchemaType = {
    quizId,
    quizTitle: "",
    totalMark: 5,
    usersId: [],
    questions: [
      {
        questionId: initialQuestionId,
        quizId,
        questionText: "",
        mark: 5,
        questionOrder: 1,
        options: [
          {
            optionId: createId(),
            questionId: initialQuestionId,
            optionText: "",
            isCorrectOption: true,
            optionOrder: 1,
          },
          {
            optionId: createId(),
            questionId: initialQuestionId,
            optionText: "",
            isCorrectOption: false,
            optionOrder: 2,
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
        className="flex max-w-[1024] flex-col gap-6"
        onSubmit={handleSubmit(createQuizAction)}
      >
        <FormField
          name="quizTitle"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Exam Name" type="text" />
                </FormControl>
              </FormItem>
            </div>
          )}
        />

        <Badge variant="outline" className="w-fit">
          Total Mark:&nbsp;{totalMark}
        </Badge>

        <QuestionsField />

        <AvailableUsersField
          isLoading={isLoading}
          availableUsers={availableUsers}
          fieldHeading="Add users to this exam"
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
          className="flex w-fit items-center justify-center gap-3  disabled:cursor-not-allowed"
        >
          <h6 className="md:text-lg">Create Exam</h6>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}

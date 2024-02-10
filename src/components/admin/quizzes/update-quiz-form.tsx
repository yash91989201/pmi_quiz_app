"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { updateQuiz } from "@/server/actions/quiz";
// UTILS
import { api } from "@/trpc/react";
import { editActionToast } from "@/lib/utils";
// SCHEMAS
import { QuizFormSchema } from "@/lib/schema";
// TYPES
import type { QuizFormSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import QuestionsField from "@/components/admin/quizzes/quiz-form-fields/questions-field";
import AvailableUsersField from "@/components/admin/quizzes/quiz-form-fields/available-users-field";
// ICONS
import { CheckCircle2, Loader2, RotateCcw, XCircle } from "lucide-react";

export default function UpdateQuizForm({
  defaultValues,
}: {
  defaultValues: QuizFormSchemaType;
}) {
  const router = useRouter();
  const { data, isLoading } = api.user.getAllUsers.useQuery();
  const availableUsers = data ?? [];

  const [actionResponse, setActionResponse] =
    useState<UpdateQuizFormStatusType>();

  const quizForm = useForm<QuizFormSchemaType>({
    defaultValues,
    resolver: zodResolver(QuizFormSchema),
    shouldUseNativeValidation: true,
  });

  const { handleSubmit, formState, reset, watch, getValues } = quizForm;

  const updateQuizAction: SubmitHandler<QuizFormSchemaType> = async (data) => {
    const totalMark = getValues("questions")
      .map((question) => question.mark)
      .reduce((totalMark, currentMark) => totalMark + currentMark, 0);

    const actionResponse = await updateQuiz({
      ...data,
      totalMark,
    });

    setActionResponse(actionResponse);
    if (actionResponse.status === "SUCCESS") {
      const optionsActions = actionResponse.fields?.options;
      const questionsActions = actionResponse.fields?.questions;
      const usersActions = actionResponse.fields?.users;

      editActionToast(optionsActions?.insert);
      editActionToast(optionsActions?.update);
      editActionToast(optionsActions?.delete);

      editActionToast(questionsActions?.insert);
      editActionToast(questionsActions?.update);
      editActionToast(questionsActions?.delete);

      editActionToast(usersActions?.insert);
      editActionToast(usersActions?.delete);

      setTimeout(() => {
        router.replace("/admin/quizzes");
      }, 4000);
    }
  };

  const totalMark = watch("questions")
    .map((question) => question.mark)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (
    <Form {...quizForm}>
      <form
        className="flex max-w-[1024] flex-col gap-6"
        onSubmit={handleSubmit(updateQuizAction)}
        onReset={() => reset()}
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

        <Badge variant="outline" className="w-fit">
          Total Mark:&nbsp;{totalMark}
        </Badge>

        <QuestionsField />

        <AvailableUsersField
          isLoading={isLoading}
          availableUsers={availableUsers}
          fieldHeading="Add/Remove users from quiz"
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

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="flex w-fit items-center justify-center gap-3  disabled:cursor-not-allowed"
          >
            <h6 className="md:text-lg">Update Exam</h6>
            {formState.isSubmitting && <Loader2 className="animate-spin" />}
          </Button>
          <Button
            type="reset"
            variant="outline"
            disabled={!formState.isDirty}
            className="flex w-fit items-center justify-center gap-3  disabled:cursor-not-allowed"
          >
            <h6 className="md:text-lg">Reset</h6>
            <RotateCcw size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
}

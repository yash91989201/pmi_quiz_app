"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
// ACTIONS
// SCHEMAS
import { UserQuizFormSchema } from "@/lib/schema";
// TYPES
import type { UserQuizFormSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// ICONS
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { submitQuiz } from "@/server/actions/quiz";

type QuestionType = {
  quizId: string;
  questionId: string;
  questionText: string;
  mark: number;
  options: {
    optionId: string;
    questionId: string;
    optionText: string;
    isSelected: boolean;
  }[];
};

export default function UserQuizForm({
  questions,
  quizId,
  userQuizId,
}: {
  userQuizId: string;
  quizId: string;
  questions: QuestionType[];
}) {
  const router = useRouter();
  const [actionResponse, setActionResponse] =
    useState<CreateQuizFormSatusType>();

  const quizForm = useForm<UserQuizFormSchemaType>({
    defaultValues: {
      quizId: quizId,
      userQuizId: userQuizId,
      questions,
    },
    resolver: zodResolver(UserQuizFormSchema),
    shouldUseNativeValidation: true,
  });

  const { handleSubmit, formState } = quizForm;
  console.log(formState.errors);
  const createQuizAction: SubmitHandler<UserQuizFormSchemaType> = async (
    data,
  ) => {
    const actionResponse = await submitQuiz(data);

    setActionResponse(actionResponse);
    if (actionResponse.status === "SUCCESS") {
      setTimeout(() => {
        router.replace("/quizzes");
      }, 1500);
    }
  };

  return (
    <Form {...quizForm}>
      <form
        className="flex w-[480px] flex-col gap-3"
        onSubmit={handleSubmit(createQuizAction)}
      >
        <QuestionsField />

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
          className="flex items-center justify-center gap-3 disabled:cursor-not-allowed"
        >
          <h6 className="md:text-lg">Submit</h6>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}

function QuestionsField() {
  const { control } = useFormContext<UserQuizFormSchemaType>();

  const { fields } = useFieldArray({
    name: "questions",
    control: control,
  });

  return (
    <div className="flex flex-col gap-3">
      {fields.map((question, index) => (
        <Fragment key={question.id}>
          <div>
            <span className="text-xl font-bold text-primary">{index + 1}</span>
            <span>/{fields.length}</span>
          </div>
          <div className="flex gap-3">
            <p>{question.questionText}</p>

            <div>
              <p>Mark:&nbsp;{question.mark}</p>
            </div>
          </div>

          <OptionsField questionIndex={index} />
        </Fragment>
      ))}
    </div>
  );
}

function OptionsField({ questionIndex }: { questionIndex: number }) {
  const { control } = useFormContext<UserQuizFormSchemaType>();
  const { fields } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={control}
        name={`questions.${questionIndex}.options`}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                className="flex flex-col space-y-1"
                value={
                  field.value.find((option) => option.isSelected)?.optionId
                }
                onValueChange={(optionId) => {
                  const updatedOptions = field.value.map((option) => ({
                    ...option,
                    isSelected: option.optionId === optionId,
                  }));
                  field.onChange(updatedOptions);
                }}
              >
                {fields.map((option) => (
                  <FormItem
                    key={option.id}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={option.optionId} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.optionText}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

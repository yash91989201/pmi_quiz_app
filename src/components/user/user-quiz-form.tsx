"use client";
import "@/styles/tiptap.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import parse from "html-react-parser";
// ACTIONS
import { submitQuiz } from "@/server/actions/quiz";
// SCHEMAS
import { UserQuizFormSchema } from "@/lib/schema";
// TYPES
import type {
  UserQuestionsSchemaType,
  UserQuizFormSchemaType,
} from "@/lib/schema";
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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// ICONS
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Image from "next/image";

export default function UserQuizForm({
  questions,
  quizId,
  userQuizId,
}: {
  userQuizId: string;
  quizId: string;
  questions: UserQuestionsSchemaType[];
}) {
  const router = useRouter();
  const [actionResponse, setActionResponse] = useState<QuizFormStatusType>();

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

  // useBeforeUnload(true, "Your quiz will be submitted as it is.");

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
        className="flex flex-col gap-3"
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
          className="flex w-fit items-center justify-center gap-3 disabled:cursor-not-allowed"
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
        <Card key={question.id} className="md:min-w-[480px]">
          <CardHeader className="flex w-full flex-row items-center justify-between">
            <p>
              <span className="text-xl font-bold text-primary">
                {index + 1}
              </span>
              /{fields.length}
            </p>
            <Badge variant="outline">Mark:&nbsp;{question.mark}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {(question.questionImageId ?? "").length > 0 && (
                <div className="relative h-48 w-4/5 sm:h-52 sm:w-96">
                  <Image
                    src={`https://drive.google.com/uc?export=view&id=${question.questionImageId}`}
                    alt="PMI"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <section className="flex-1">
                {parse(question.questionText)}
              </section>
            </div>
          </CardContent>
          <CardFooter>
            <OptionsField questionIndex={index} />
          </CardFooter>
        </Card>
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
    <div className="flex flex-row gap-3">
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

"use client";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
// ACTIONS
import { createQuiz } from "@/server/actions/quiz";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// SCHEMAS
import { QuizFormSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { QuizFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TipTap from "@/components/admin/quizzes/TipTap";
// ICONS
import { CheckCircle2, Loader2, Plus, Trash2, XCircle } from "lucide-react";

export default function CreateQuizForm() {
  const quizId = createId();
  const initialQuestionId = createId();
  const { data, isLoading } = api.user.getUsersId.useQuery();
  const availableUsers = data ?? [];

  const [actionResponse, setActionResponse] =
    useState<CreateQuizFormSatusType>();
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

        {isLoading ? (
          <AvailableUsersLoading />
        ) : (
          <AvailableUsersField availableUsers={availableUsers} />
        )}

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

function QuestionsField() {
  const { control, getValues } = useFormContext<QuizFormSchemaType>();

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control: control,
  });

  const addQuestion = () => {
    const newQuestionId = createId();
    const quizId = getValues("quizId");

    append({
      questionId: newQuestionId,
      quizId,
      questionText: "",
      mark: 5,
      options: [
        {
          optionId: createId(),
          questionId: newQuestionId,
          optionText: "",
          isCorrectOption: true,
        },
        {
          optionId: createId(),
          questionId: newQuestionId,
          optionText: "",
          isCorrectOption: false,
        },
      ],
    });
  };

  const deleteQuestion = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex flex-col gap-3">
      {fields.map((question, index) => (
        <Fragment key={question.id}>
          <div>
            <span className="text-xl font-bold text-primary">{index + 1}</span>
            <span>/{fields.length}</span>
          </div>
          <div className="flex flex-col gap-3">
            <FormField
              name={`questions.${index}.questionText`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TipTap
                      text={field.value as string}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <FormField
                name={`questions.${index}.mark`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <p>Mark</p>
                        <Input
                          {...field}
                          placeholder="Mark"
                          pattern="[0-9\/]*"
                          minLength={1}
                          className="w-fit"
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="ghost"
                onClick={() => deleteQuestion(index)}
                disabled={fields.length == 1}
                type="button"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          <OptionsField questionIndex={index} />
        </Fragment>
      ))}
      <Button
        variant="outline"
        type="button"
        className="w-fit"
        onClick={() => addQuestion()}
      >
        Add Question
      </Button>
    </div>
  );
}

function OptionsField({ questionIndex }: { questionIndex: number }) {
  const { control, getValues } = useFormContext<QuizFormSchemaType>();
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const addOption = () => {
    const questionId = getValues(`questions.${questionIndex}`).questionId;

    append({
      optionId: createId(),
      questionId,
      optionText: "",
      isCorrectOption: false,
    });
  };

  const deleteOption = (index: number) => {
    remove(index);
  };

  const updateCorrectOption = (index: number) => {
    const allOptions = getValues(`questions.${questionIndex}.options`);
    const updatedOptions = allOptions.map((option, optionIndex) => ({
      ...option,
      isCorrectOption: optionIndex === index,
    }));

    updatedOptions.forEach((option, index) => {
      update(index, option);
    });
  };

  return (
    <div className="space-y-2">
      {fields.map((option, index) => (
        <FormField
          key={option.id}
          name={`questions.${questionIndex}.options.${index}.optionText`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-3">
                  <div
                    className="flex cursor-pointer items-center  justify-center rounded-full border border-primary p-0.5"
                    role="button"
                    onClick={() => updateCorrectOption(index)}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full ",
                        option.isCorrectOption ? "bg-primary" : "bg-white",
                      )}
                    />
                  </div>
                  <Input
                    {...field}
                    placeholder={`Option ${index + 1}`}
                    type="text"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => deleteOption(index)}
                    disabled={fields.length <= 2 || option.isCorrectOption}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      ))}
      {fields.length < 4 && (
        <Button
          variant="outline"
          type="button"
          className="gap-2"
          onClick={() => addOption()}
        >
          <Plus size={16} />
          <span>Add Option</span>
        </Button>
      )}
    </div>
  );
}

function AvailableUsersField({
  availableUsers,
}: {
  availableUsers: {
    id: string;
    name: string;
  }[];
}) {
  const { control } = useFormContext<QuizFormSchemaType>();

  // TODO: create select all functionality
  // const selectAll=()=>{}
  // const isAllSelected=()=>{}

  return (
    <>
      {availableUsers.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-lg font-medium">Add Users to this quiz.</p>
          <FormField
            control={control}
            name="usersId"
            render={() => (
              <FormItem>
                {availableUsers.map((user) => (
                  <FormField
                    key={user.id}
                    control={control}
                    name="usersId"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={user.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(user.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, user.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== user.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {user.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <p>No users available.</p>
      )}
    </>
  );
}

function AvailableUsersLoading() {
  return (
    <div>
      <p>Loading available Users.</p>
    </div>
  );
}

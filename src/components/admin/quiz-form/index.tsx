"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";

import { useFieldArray, useForm, useFormContext } from "react-hook-form";

import type { QuizFormSchemaType } from "@/lib/schema";
import { QuizFormSchema } from "@/lib/schema";
import { Fragment } from "react";
import { createQuiz } from "@/server/actions/quiz";

export default function QuizForm() {
  const quizId = createId();
  const initialQuestionId = createId();

  const defaultValues: QuizFormSchemaType = {
    quizId,
    quizTitle: "Javascript Quiz",
    totalMark: 5,
    questions: [
      {
        questionId: initialQuestionId,
        quizId,
        questionText: "What is hoisting",
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

  const { handleSubmit, formState } = quizForm;

  const createQuizAction: SubmitHandler<QuizFormSchemaType> = async (data) => {
    const actionResponse = await createQuiz(data);
    console.log(actionResponse);
  };

  return (
    <Form {...quizForm}>
      <form
        className="flex w-[480px] flex-col gap-3"
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
        <FormField
          name="totalMark"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Quiz Marks"
                    type="text"
                    pattern="[0-9\/]*"
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                  />
                </FormControl>
              </FormItem>
            </div>
          )}
        />
        <QuestionsField />
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="flex items-center justify-center gap-3 disabled:cursor-not-allowed"
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
          <FormField
            name={`questions.${index}.questionText`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-primary">
                      {index + 1}
                    </span>
                    <span>/{fields.length}</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => deleteQuestion(index)}
                    disabled={fields.length == 1}
                    type="button"
                  >
                    <Trash2 />
                  </Button>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Question ${index + 1}`}
                    type="text"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <OptionsField questionIndex={index} />
        </Fragment>
      ))}
      <Button variant="outline" type="button" onClick={() => addQuestion()}>
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
    <div className="grid grid-cols-2 gap-3">
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
        <Button variant="outline" type="button" onClick={() => addOption()}>
          <Plus />
          <span>Add Option</span>
        </Button>
      )}
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { Plus, Trash2 } from "lucide-react";
import type { Control, SubmitHandler } from "react-hook-form";

import { useFieldArray, useForm } from "react-hook-form";

import { QuizFormSchema } from "@/lib/schema";
import type { QuizFormSchemaType } from "@/lib/schema";

export default function QuizForm() {
  const quizId = createId();

  const defaultValues: QuizFormSchemaType = {
    quizId,
    quizName: "",
    totalMark: 5,
    questions: [
      {
        id: createId(),
        questionText: "",
        mark: 5,
        options: [
          {
            optionText: "",
            isCorrectOption: true,
          },
          {
            optionText: "",
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

  const { control, handleSubmit } = quizForm;

  const createQuizAction: SubmitHandler<QuizFormSchemaType> = (data) => {
    console.log(data);
  };

  return (
    <Form {...quizForm}>
      <form
        className="flex w-[480px] flex-col gap-3"
        onSubmit={handleSubmit(createQuizAction)}
      >
        <FormField
          name="quizName"
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
                    type="number"
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                    className="[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </FormControl>
              </FormItem>
            </div>
          )}
        />
        <QuestionsField control={control} />
        <Button>Create Quiz</Button>
      </form>
    </Form>
  );
}

function QuestionsField({ control }: { control: Control<QuizFormSchemaType> }) {
  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control: control,
  });

  const addQuestion = () => {
    append({
      id: createId(),
      questionText: "",
      mark: 5,
      options: [
        {
          optionText: "",
          isCorrectOption: true,
        },
        {
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
        <FormField
          key={question.id}
          name={`questions.${index}.questionText`}
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <FormItem>
                <FormLabel className="flex items-center  justify-between">
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
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Question ${index + 1}`}
                    type="text"
                  />
                </FormControl>
              </FormItem>
              <OptionsField questionIndex={index} control={control} />
            </div>
          )}
        />
      ))}
      <Button variant="outline" type="button" onClick={() => addQuestion()}>
        Add Question
      </Button>
    </div>
  );
}

function OptionsField({
  questionIndex,
  control,
}: {
  questionIndex: number;
  control: Control<QuizFormSchemaType>;
}) {
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const addOption = () => {
    append({
      optionText: "",
      isCorrectOption: false,
    });
  };

  const deleteOption = (index: number) => {
    remove(index);
  };

  const updateCorrectOption = ({
    optionId,
  }: {
    index: number;
    optionId: string;
  }) => {
    const allOptions = fields;
    allOptions.map((option, index) => {
      update(index, {
        optionText: option.optionText,
        isCorrectOption: option.id === optionId,
      });
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
                    onClick={() =>
                      updateCorrectOption({
                        index,
                        optionId: option.id,
                      })
                    }
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
                    disabled={fields.length <= 2}
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

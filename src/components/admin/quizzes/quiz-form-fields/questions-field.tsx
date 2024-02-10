"use client";
import { createId } from "@paralleldrive/cuid2";
import { Fragment, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// TYPES
import type { QuizFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TipTap from "@/components/admin/quizzes/TipTap";
import OptionsField from "@/components/admin/quizzes/quiz-form-fields/options-field";
// ICONS
import { Trash2 } from "lucide-react";

export default function QuestionsField() {
  const { control, getValues, setValue } = useFormContext<QuizFormSchemaType>();

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control: control,
  });

  useEffect(() => {
    fields.map((field, index) => {
      setValue(`questions.${index}.questionOrder`, index + 1);
    });
  }, [fields, setValue]);

  const addQuestion = () => {
    const newQuestionId = createId();
    const quizId = getValues("quizId");

    append({
      questionId: newQuestionId,
      quizId,
      questionText: "",
      mark: 5,
      questionOrder: fields.length + 1,
      questionImageId: "",
      options: [
        {
          optionId: createId(),
          questionId: newQuestionId,
          optionText: "",
          isCorrectOption: true,
          optionOrder: 1,
        },
        {
          optionId: createId(),
          questionId: newQuestionId,
          optionText: "",
          isCorrectOption: false,
          optionOrder: 2,
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                          className="w-20"
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

              <FormField
                name={`questions.${index}.questionImageId`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <p>Question image id</p>
                        <Input {...field} className="w-48" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="ghost"
                className="w-fit"
                onClick={() => deleteQuestion(index)}
                disabled={fields.length == 1}
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

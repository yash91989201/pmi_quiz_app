"use client";
import { createId } from "@paralleldrive/cuid2";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// TYPES
import type { QuizFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import TipTap from "@/components/admin/quizzes/TipTap";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OptionsField from "@/components/admin/quizzes/quiz-form-fields/options-field";
// ICONS
import { Trash2 } from "lucide-react";

export default function QuestionsField() {
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

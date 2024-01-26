"use client";
import { createId } from "@paralleldrive/cuid2";
import { useFieldArray, useFormContext } from "react-hook-form";
// UTILS
import { cn } from "@/lib/utils";
// TYPES
import type { QuizFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// ICONS
import { Plus, Trash2 } from "lucide-react";

export default function OptionsField({
  questionIndex,
}: {
  questionIndex: number;
}) {
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

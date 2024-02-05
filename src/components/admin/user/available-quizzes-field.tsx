"use client";
import { useFormContext } from "react-hook-form";
// TYPES
import type { CreateUserFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function AvailableQuizzesField({
  isLoading,
  availableQuizzes,
  fieldHeading,
}: {
  isLoading: boolean;
  availableQuizzes: {
    quizId: string;
    quizTitle: string;
  }[];
  fieldHeading: string;
}) {
  const { control } = useFormContext<CreateUserFormSchemaType>();

  if (isLoading) return <p>Loading available exams.</p>;

  if (availableQuizzes.length === 0) return <p>No exams available.</p>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-medium">{fieldHeading}</p>
      <FormField
        control={control}
        name="quizzesId"
        render={() => (
          <FormItem>
            {availableQuizzes.map((quiz) => (
              <FormField
                key={quiz.quizId}
                control={control}
                name="quizzesId"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={quiz.quizId}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(quiz.quizId)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, quiz.quizId])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== quiz.quizId,
                                  ),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {quiz.quizTitle}
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
  );
}

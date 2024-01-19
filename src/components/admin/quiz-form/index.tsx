"use client";
import useQuiz from "@/hooks/use-quiz";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";

export default function QuizForm() {
  const {
    quizId,
    options,
    questions,
    totalMark,
    getQuestionOptions,
    addNewQuestion,
    setQuestionText,
    appendOptionToQuestion,
  } = useQuiz();

  console.log(questions);
  return (
    <div>
      <div className="flex flex-col gap-3">
        {questions.map((question) => (
          <QuestionForm
            key={question.id}
            id={question.id}
            quizId={quizId}
            questionText={question.questionText}
            mark={question.mark}
            options={getQuestionOptions(question.id)}
            appendOptionToQuestion={appendOptionToQuestion}
          />
        ))}
      </div>
      <button onClick={addNewQuestion}>Add Question</button>
    </div>
  );
}

type QuestionType = {
  id: string;
  quizId: string;
  questionText: string;
  mark: number;
  options: OptionType[];
  appendOptionToQuestion: (questionId: string) => void;
};

type OptionType = {
  quizId: string;
  questionId: string;
  optionText: string;
  isCorrectOption: boolean;
};

function QuestionForm({
  id,
  quizId,
  questionText,
  mark,
  options,
}: QuestionType) {
  const questionForm = useForm<QuestionType>({
    defaultValues: {
      id,
      quizId,
      questionText,
      mark,
      options,
    },
  });
  const { control, handleSubmit } = questionForm;
  const { fields, remove, append } = useFieldArray({
    name: "options",
    control,
  });

  const addOption = () => {
    append({
      quizId,
      questionId: id,
      optionText: "",
      isCorrectOption: false,
    });
  };

  const removeOption = (index: number) => {
    remove(index);
  };

  const submit: SubmitHandler<QuestionType> = (data) => {
    console.log(data);
  };

  return (
    <Form {...questionForm}>
      <form
        className="flex w-[480px] flex-col gap-3"
        onSubmit={handleSubmit(submit)}
      >
        <FormField
          name="questionText"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Input {...field} placeholder="Enter question" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <FormField
                name={`options.${index}.optionText` as const}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Option {index + 1}</FormLabel> */}
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input {...field} placeholder={`Option ${index + 1}`} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="ghost"
                onClick={() => removeOption(index)}
                disabled={fields.length <= 2}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          {fields.length < 4 && (
            <Button
              className="flex items-center justify-center gap-3 border"
              variant="outline"
              onClick={addOption}
              type="button"
            >
              <Plus />
              <span>Add Option</span>
            </Button>
          )}
        </div>
        <button>submit</button>
      </form>
    </Form>
  );
}

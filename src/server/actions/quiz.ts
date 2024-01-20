"use server";
import { QuizFormSchema } from "@/lib/schema";
import type { OptionSchemaType, QuizFormSchemaType } from "@/lib/schema";
import { db } from "@/server/db";
import { options, questions, quizzes } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

async function createQuiz(
  formData: QuizFormSchemaType,
): Promise<CreateQuizFormSatusType> {
  const validatedFormData = QuizFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to create quiz.",
    };
  }

  const {
    quizId,
    quizTitle,
    questions: quizQuestions,
    totalMark,
  } = validatedFormData.data;
  const quizData = {
    quizId,
    quizTitle,
    totalMark,
  };
  const allQuestions = quizQuestions.map((question) => ({
    questionId: question.questionId,
    quizId: question.quizId,
    questionText: question.questionText,
    mark: question.mark,
  }));

  let allOptions: OptionSchemaType[] = [];
  quizQuestions.map((question) => {
    allOptions = [...allOptions, ...question.options];
  });

  await db.insert(quizzes).values(quizData);
  await db.insert(questions).values(allQuestions);
  await db.insert(options).values(allOptions);

  revalidatePath("/admin/quizzes");
  return {
    status: "SUCCESS",
    message: "Quiz created.",
  };
}

export { createQuiz };

"use server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
// UTILS
import { db } from "@/server/db";
// SCHEMAS
import { DeleteQuizFormSchema, QuizFormSchema } from "@/lib/schema";
import { options, questions, quizzes, userQuizzes } from "@/server/db/schema";
// TYPES
import type {
  DeleteQuizFormSchemaType,
  OptionSchemaType,
  QuizFormSchemaType,
} from "@/lib/schema";

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
    usersId,
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

  const newQuiz = await db.insert(quizzes).values(quizData);
  await db.insert(questions).values(allQuestions);
  await db.insert(options).values(allOptions);

  if (usersId.length > 0) {
    const quizzesSelectedForUser = usersId.map((userId) => ({
      userId,
      quizId,
    }));

    const newUserQuizzes = await db
      .insert(userQuizzes)
      .values(quizzesSelectedForUser);

    revalidatePath("/admin/quizzes");

    if (newQuiz[0].affectedRows == 1 && newUserQuizzes[0].affectedRows >= 1) {
      return {
        status: "SUCCESS",
        message: "Quiz created and user added successfully.",
      };
    } else {
      return {
        status: "FAILED",
        message: "Unable to create quiz.",
      };
    }
  }

  revalidatePath("/admin/quizzes");

  if (newQuiz[0].affectedRows == 1) {
    return { status: "SUCCESS", message: "Quiz created successfully." };
  }

  return {
    status: "FAILED",
    message: "Unable to create quiz.",
  };
}

async function deleteQuiz(
  formData: DeleteQuizFormSchemaType,
): Promise<DeleteQuizFormStatusType> {
  const validatedFormData = DeleteQuizFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to delete quiz.",
    };
  }
  const { quizId } = validatedFormData.data;
  const existingUserQuizzes = await db.query.userQuizzes.findMany({
    where: and(
      eq(userQuizzes.quizId, quizId),
      eq(userQuizzes.status, "IN_PROGRESS"),
    ),
  });
  const isQuizInProgress = existingUserQuizzes.length > 0;

  if (isQuizInProgress) {
    return {
      status: "FAILED",
      message: "Some user is taking this quiz. Try later",
    };
  }

  const deleteQuizQuery = await db
    .delete(quizzes)
    .where(eq(quizzes.quizId, quizId));
  await db.delete(userQuizzes).where(eq(userQuizzes.quizId, quizId));

  revalidatePath("/admin/quizzes");

  if (deleteQuizQuery[0].affectedRows >= 1) {
    return {
      status: "SUCCESS",
      message: "Quiz deleted successfully.",
    };
  }
  return {
    status: "FAILED",
    message: "Unable to delete quiz. Try later.",
  };
}

export { createQuiz, deleteQuiz };

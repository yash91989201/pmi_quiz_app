"use server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
// UTILS
import { db } from "@/server/db";
// SCHEMAS
import {
  DeleteQuizFormSchema,
  QuizFormSchema,
  UserQuizFormSchema,
} from "@/lib/schema";
import { options, questions, quizzes, userQuizzes } from "@/server/db/schema";
// TYPES
import type {
  DeleteQuizFormSchemaType,
  OptionSchemaType,
  QuizFormSchemaType,
  UserQuizFormSchemaType,
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
      quizTitle,
      totalMark,
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

async function submitQuiz(
  formData: UserQuizFormSchemaType,
): Promise<UserQuizFormStatusType> {
  const validatedFormData = UserQuizFormSchema.safeParse(formData);
  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to submit quiz try later",
    };
  }

  const {
    quizId,
    questions: answerToCheck,
    userQuizId,
  } = validatedFormData.data;

  const quizQuestions = await db.query.questions.findMany({
    where: eq(questions.quizId, quizId),
    with: {
      options: true,
    },
  });

  // const totalMark = answerToCheck.reduce(
  //   (total, currentValue, currentIndex) => {
  //     //  if correct option is true in answertocheck add mark in total
  //     const optionSelectedByUser = currentValue.options.find(
  //       (option) => option.isSelected,
  //     );
  //     if (optionSelectedByUser === undefined) return total;

  //     const currentQuestionToCheck = quizQuestions.find(
  //       (quizQuestion) => quizQuestion.questionId === currentValue.questionId,
  //     )!;
  //     const currentQuestionOption = currentQuestionToCheck.options.find(
  //       (option) => option.isCorrectOption,
  //     )!;
  //     if (optionSelectedByUser.optionId === currentQuestionOption.optionId)
  //       return total + currentQuestionToCheck.mark;

  //     return total;
  //   },
  //   0,
  // );

  const score = answerToCheck.reduce((total, currentValue) => {
    const optionSelectedByUser = currentValue.options.find(
      (option) => option.isSelected,
    );

    if (!optionSelectedByUser) return total;

    const currentQuestionToCheck = quizQuestions.find(
      (quizQuestion) => quizQuestion.questionId === currentValue.questionId,
    );

    if (!currentQuestionToCheck) return total;

    const currentQuestionOption = currentQuestionToCheck.options.find(
      (option) => option.isCorrectOption,
    );

    if (!currentQuestionOption) return total;

    if (optionSelectedByUser.optionId === currentQuestionOption.optionId) {
      return total + currentQuestionToCheck.mark;
    }

    return total;
  }, 0);

  await db
    .update(userQuizzes)
    .set({
      score,
      status: "COMPLETED",
    })
    .where(eq(userQuizzes.userQuizId, userQuizId));

  revalidatePath("/quizzes");
  return {
    status: "SUCCESS",
    message: `You scored ${score}`,
  };
}

export { createQuiz, deleteQuiz, submitQuiz };

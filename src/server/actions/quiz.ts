"use server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
// UTILS
import { db } from "@/server/db";
// SCHEMAS
import {
  DeleteQuizFormSchema,
  DeleteUserQuizFormSchema,
  QuizFormSchema,
  ResetUserQuizFormSchema,
  UserQuizFormSchema,
} from "@/lib/schema";
import { options, questions, quizzes, userQuizzes } from "@/server/db/schema";
// TYPES
import type {
  DeleteQuizFormSchemaType,
  DeleteUserQuizFormSchemaType,
  OptionSchemaType,
  QuestionSchemaType,
  QuizFormSchemaType,
  ResetUserQuizFormSchemaType,
  UserQuizFormSchemaType,
} from "@/lib/schema";

export async function createQuiz(
  formData: QuizFormSchemaType,
): Promise<QuizFormStatusType> {
  const validatedFormData = QuizFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to create exam.",
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

  const allQuestions = quizQuestions.map(({ options: _o, ...question }) => ({
    ...question,
  }));

  const allOptions = quizQuestions.flatMap((question) => question.options);

  const newQuiz = await db.insert(quizzes).values(quizData);
  await db.insert(questions).values(allQuestions);
  await db.insert(options).values(allOptions);

  if (usersId.length > 0) {
    const selectedUserQuizzes = usersId.map((userId) => ({
      userId,
      ...quizData,
    }));

    const newUserQuizzes = await db
      .insert(userQuizzes)
      .values(selectedUserQuizzes);

    revalidatePath("/admin/quizzes");

    if (newQuiz[0].affectedRows == 1 && newUserQuizzes[0].affectedRows >= 1) {
      return {
        status: "SUCCESS",
        message: "Quiz created and user added successfully.",
      };
    } else {
      return {
        status: "FAILED",
        message: "Unable to create exam.",
      };
    }
  }

  revalidatePath("/admin/quizzes");

  if (newQuiz[0].affectedRows == 1) {
    return { status: "SUCCESS", message: "Quiz created successfully." };
  }

  return {
    status: "FAILED",
    message: "Unable to create exam.",
  };
}

export async function updateQuiz(
  formData: QuizFormSchemaType,
): Promise<UpdateQuizFormStatusType> {
  const validatedFormData = QuizFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to create exam.",
    };
  }

  const {
    quizId,
    quizTitle,
    totalMark,
    questions: quizQuestions,
    usersId: updatedUsersId,
  } = validatedFormData.data;

  const inProgressUsersQuiz = await db.query.userQuizzes.findMany({
    where: and(
      eq(userQuizzes.quizId, quizId),
      eq(userQuizzes.status, "IN_PROGRESS"),
    ),
  });
  const isQuizInProgress = inProgressUsersQuiz.length > 0;

  if (isQuizInProgress) {
    return {
      status: "FAILED",
      message: `${inProgressUsersQuiz.length} Users are taking this quiz.`,
    };
  }

  const existingQuizData = (await db.query.quizzes.findFirst({
    where: eq(quizzes.quizId, quizId),
  }))!;

  const existingQuestionsData = await db.query.questions.findMany({
    where: eq(questions.quizId, quizId),
    with: {
      options: true,
    },
  });

  const existingUsersInQuiz = await db.query.userQuizzes.findMany({
    where: eq(userQuizzes.quizId, quizId),
    columns: {
      userId: true,
    },
  });

  const updatedQuestions = quizQuestions.map(
    ({ options: _o, ...question }) => ({
      ...question,
    }),
  );

  const updatedOptions = quizQuestions.flatMap((question) => question.options);

  const existingQuestions = existingQuestionsData.map(
    ({ options: _o, ...question }) => ({
      ...question,
    }),
  );

  const existingOptions = existingQuestionsData.flatMap(
    (question) => question.options,
  );

  const existingUsersId = existingUsersInQuiz.map(
    (existingUser) => existingUser.userId,
  );

  const isQuizDataUpdated =
    existingQuizData.quizTitle !== quizTitle ||
    existingQuizData.totalMark !== totalMark;

  const addedQuestions: QuestionSchemaType[] = [];
  const updatedQuestionsId: string[] = [];
  const deletedQuestionsId: string[] = [];
  const addedOptions: OptionSchemaType[] = [];
  const updatedOptionsId: string[] = [];
  const deletedOptionsId: string[] = [];
  const addedUsersId: string[] = [];
  const deletedUsersId: string[] = [];

  /*
    loop over existingQuestions from database
    and find the updated/deleted question'ss id 
  */
  existingQuestions.forEach((existingQuestion) => {
    const updatedQuestion = updatedQuestions.find(
      (updatedQuestion) =>
        updatedQuestion.questionId === existingQuestion.questionId,
    );
    if (updatedQuestion === undefined) {
      deletedQuestionsId.push(existingQuestion.questionId);
      return;
    }
    if (
      updatedQuestion.questionText !== existingQuestion.questionText ||
      updatedQuestion.mark !== existingQuestion.mark ||
      updatedQuestion.questionOrder !== existingQuestion.questionOrder
    ) {
      updatedQuestionsId.push(updatedQuestion.questionId);
    }
  });

  /*
    loop over updatedQuestions from user input
    and find the added question's id 
  */
  updatedQuestions.forEach((updatedQuestion) => {
    const existingQuestion = existingQuestions.find(
      (existingQuestion) =>
        existingQuestion.questionId === updatedQuestion.questionId,
    );

    if (existingQuestion !== undefined) return;
    addedQuestions.push(updatedQuestion);
  });

  /*
    loop over existingOptions from database
    and find the updated/deleted option's id 
  */
  existingOptions.forEach((existingOption) => {
    if (deletedQuestionsId.includes(existingOption.questionId)) return;

    const updatedOption = updatedOptions.find(
      (updatedOption) => updatedOption.optionId === existingOption.optionId,
    );

    if (updatedOption === undefined) {
      deletedOptionsId.push(existingOption.optionId);
      return;
    }

    if (
      updatedOption.optionText !== existingOption.optionText ||
      updatedOption.isCorrectOption !== existingOption.isCorrectOption
    ) {
      updatedOptionsId.push(updatedOption.optionId);
    }
  });

  /*
    loop over updatedOptions from user input
    and find the added options's id 
  */
  updatedOptions.forEach((updatedOption) => {
    const existingOption = existingOptions.find(
      (existingOption) => existingOption.optionId === updatedOption.optionId,
    );
    if (existingOption !== undefined) return;
    addedOptions.push(updatedOption);
  });

  /*
  if an user from existing list is not in updated list
  then that user was removed
  */
  existingUsersId.forEach((existingUserId) => {
    if (!updatedUsersId.includes(existingUserId))
      deletedUsersId.push(existingUserId);
  });

  /*
  if an user from updated list is not in existing list 
  then that user was added 
*/
  updatedUsersId.forEach((updatedUserId) => {
    if (!existingUsersId.includes(updatedUserId))
      addedUsersId.push(updatedUserId);
  });

  let updateAllQuizDataStatus: UpdateQuizFormStatusType = {
    status: "SUCCESS",
    message: "Quiz Edit Completed",
    fields: {},
  };

  if (isQuizDataUpdated) {
    const quizUpdateQuery = await db
      .update(quizzes)
      .set({
        quizTitle,
        totalMark,
      })
      .where(eq(quizzes.quizId, quizId));
    const quizUpdateSuccess = quizUpdateQuery[0].affectedRows > 0;

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        quiz: {
          ...updateAllQuizDataStatus.fields.quiz,
          update: {
            status: quizUpdateSuccess ? "SUCCESS" : "FAILED",
            message: quizUpdateSuccess
              ? "Quiz data update successful."
              : "Quiz data update failed. Try again!",
          },
        },
      },
    };
  }

  if (addedQuestions.length > 0) {
    const insertQuestionsQuery = await db
      .insert(questions)
      .values(addedQuestions);

    const questionsInsertSuccess =
      insertQuestionsQuery[0].affectedRows === addedQuestions.length;

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        questions: {
          ...updateAllQuizDataStatus.fields.questions,
          insert: {
            status: questionsInsertSuccess ? "SUCCESS" : "FAILED",
            message: questionsInsertSuccess
              ? "New Question/s added successfully."
              : "Unable to add new Question/s. Try again!",
          },
        },
      },
    };
  }

  if (updatedQuestionsId.length > 0) {
    const questionsUpdateQuery = await Promise.all(
      updatedQuestionsId.map(async (updatedQuestionId) => {
        const { questionText, mark, questionId, questionOrder } =
          updatedQuestions.find(
            (updatedQuestion) =>
              updatedQuestion.questionId === updatedQuestionId,
          )!;

        const updateQuestionQuery = await db
          .update(questions)
          .set({
            mark,
            questionText,
            questionOrder,
          })
          .where(eq(questions.questionId, questionId));

        return updateQuestionQuery[0];
      }),
    );

    const questionsUpdateSuccess = questionsUpdateQuery.every(
      (questionUpdateQuery) => questionUpdateQuery.affectedRows > 0,
    );

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        questions: {
          ...updateAllQuizDataStatus.fields.questions,
          update: {
            status: questionsUpdateSuccess ? "SUCCESS" : "FAILED",
            message: questionsUpdateSuccess
              ? "Question/s updated successfully."
              : "Unable to update question/s. Try again!",
          },
        },
      },
    };
  }

  if (deletedQuestionsId.length > 0) {
    const questionsDeleteQuery = await Promise.all(
      deletedQuestionsId.map(async (deletedQuestionId) => {
        const deleteQuestionQuery = await db
          .delete(questions)
          .where(eq(questions.questionId, deletedQuestionId));
        return deleteQuestionQuery[0];
      }),
    );

    const questionsDeleteSuccess = questionsDeleteQuery.every(
      (questionDeleteQuery) => questionDeleteQuery.affectedRows > 0,
    );

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        questions: {
          ...updateAllQuizDataStatus.fields.questions,
          delete: {
            status: questionsDeleteSuccess ? "SUCCESS" : "FAILED",
            message: questionsDeleteSuccess
              ? "Question/s deleted successfully."
              : "Unable to delete question/s. Try again!",
          },
        },
      },
    };
  }

  if (addedOptions.length > 0) {
    const insertOptionsQuery = await db.insert(options).values(addedOptions);

    const optionsInsertSuccess =
      insertOptionsQuery[0].affectedRows === addedOptions.length;

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        options: {
          ...updateAllQuizDataStatus.fields.options,
          insert: {
            status: optionsInsertSuccess ? "SUCCESS" : "FAILED",
            message: optionsInsertSuccess
              ? "Option/s added successfully."
              : "Unable to update option/s. Try again!",
          },
        },
      },
    };
  }

  if (updatedOptionsId.length > 0) {
    const optionsUpdateQuery = await Promise.all(
      updatedOptionsId.map(async (updatedOptionId) => {
        const { optionId, optionText, isCorrectOption, optionOrder } =
          updatedOptions.find(
            (updatedOption) => updatedOption.optionId === updatedOptionId,
          )!;

        const optionUpdateQuery = await db
          .update(options)
          .set({
            optionText,
            isCorrectOption,
            optionOrder,
          })
          .where(eq(options.optionId, optionId));
        return optionUpdateQuery[0];
      }),
    );

    const optionsUpdateSuccess = optionsUpdateQuery.every(
      (optionUpdateQuery) => optionUpdateQuery.affectedRows > 0,
    );

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        options: {
          ...updateAllQuizDataStatus.fields.options,
          update: {
            status: optionsUpdateSuccess ? "SUCCESS" : "FAILED",
            message: optionsUpdateSuccess
              ? "Option/s updated successfully."
              : "Unable to update option/s. Try again!",
          },
        },
      },
    };
  }

  if (deletedOptionsId.length > 0) {
    const optionsDeleteQuery = await Promise.all(
      deletedOptionsId.map(async (deletedOptionId) => {
        const deleteOptionQuery = await db
          .delete(options)
          .where(eq(options.optionId, deletedOptionId));

        return deleteOptionQuery[0];
      }),
    );

    const optionsDeleteSuccess = optionsDeleteQuery.every(
      (optionDeleteQuery) => optionDeleteQuery.affectedRows > 0,
    );

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        options: {
          ...updateAllQuizDataStatus.fields.options,
          delete: {
            status: optionsDeleteSuccess ? "SUCCESS" : "FAILED",
            message: optionsDeleteSuccess
              ? "Option/s deleted succesfully."
              : "Unable to delete option/s. Try again!",
          },
        },
      },
    };
  }

  if (addedUsersId.length > 0) {
    const usersInsertQuery = await Promise.all(
      addedUsersId.map(async (addedUserId) => {
        const userAddQuery = await db.insert(userQuizzes).values({
          quizId,
          quizTitle,
          totalMark,
          userId: addedUserId,
        });
        return userAddQuery[0];
      }),
    );

    const usersQuizInsertSuccess = usersInsertQuery.every(
      (userQuizInsertQuery) => userQuizInsertQuery.affectedRows > 0,
    );

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        users: {
          ...updateAllQuizDataStatus.fields.users,
          insert: {
            status: usersQuizInsertSuccess ? "SUCCESS" : "FAILED",
            message: usersQuizInsertSuccess
              ? "User/s added successfully."
              : "Unable to add user/s. Try again!",
          },
        },
      },
    };
  }

  if (deletedUsersId.length > 0) {
    const usersDeleteQuery = await Promise.all(
      deletedUsersId.map(async (deletedUserId) => {
        const userDeleteQuery = await db
          .delete(userQuizzes)
          .where(eq(userQuizzes.userId, deletedUserId));

        return userDeleteQuery[0];
      }),
    );

    const usersQuizDeleteSuccess = usersDeleteQuery.every(
      (userQuizDeleteQuery) => userQuizDeleteQuery.affectedRows > 0,
    );

    updateAllQuizDataStatus = {
      ...updateAllQuizDataStatus,
      fields: {
        ...updateAllQuizDataStatus.fields,
        users: {
          ...updateAllQuizDataStatus.fields.users,
          delete: {
            status: usersQuizDeleteSuccess ? "SUCCESS" : "FAILED",
            message: usersQuizDeleteSuccess
              ? "User/s deleted successfully."
              : "Unable to delete user/s. Try again!",
          },
        },
      },
    };
  }

  revalidatePath("/admin/quizzes/[quizId]", "page");

  return updateAllQuizDataStatus;
}

export async function deleteQuiz(
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

  revalidatePath("/admin/quizzes");
  if (deleteQuizQuery[0].affectedRows > 0) {
    if (existingUserQuizzes.length > 0) {
      const deleteUsersQuizQuery = await db
        .delete(userQuizzes)
        .where(eq(userQuizzes.quizId, quizId));

      if (deleteUsersQuizQuery[0].affectedRows > 0) {
        return {
          status: "SUCCESS",
          message: "Quiz deleted but user quiz were not deleted.",
        };
      }

      return {
        status: "SUCCESS",
        message: "Quiz and user quizzes deleted successfully.",
      };
    }
    return {
      status: "SUCCESS",
      message: "Quiz deleted successfully.",
    };
  }
  return {
    status: "FAILED",
    message: "Unable to delete quiz. Try again!",
  };
}

export async function submitQuiz(
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

export async function deleteUserQuiz(
  formData: DeleteUserQuizFormSchemaType,
): Promise<UserQuizDeleteFormStatusType> {
  const validatedFormData = DeleteUserQuizFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to delete user's quiz. Try again!",
    };
  }
  const { userQuizId } = validatedFormData.data;
  const existingUserQuiz = await db.query.userQuizzes.findFirst({
    where: eq(userQuizzes.userQuizId, userQuizId),
  });

  if (!existingUserQuiz) {
    return {
      status: "FAILED",
      message: "Unable to delete user's quiz. Try again!",
    };
  }

  if (existingUserQuiz.status === "IN_PROGRESS") {
    return {
      status: "FAILED",
      message: "User is taking this quiz. Try later!",
    };
  }

  const userQuizDeleteQuery = await db
    .delete(userQuizzes)
    .where(eq(userQuizzes.userQuizId, userQuizId));

  revalidatePath("/admin/users/[userId]", "page");

  if (userQuizDeleteQuery[0].affectedRows > 0) {
    return { status: "SUCCESS", message: "User quiz deleted successfully." };
  }
  return {
    status: "FAILED",
    message: "Unable to delete user's quiz. Try again!",
  };
}

export async function resetUserQuiz(
  formData: ResetUserQuizFormSchemaType,
): Promise<UserQuizResetFormStatusType> {
  const validatedFormData = ResetUserQuizFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to delete user's quiz. Try again!",
    };
  }
  const { userQuizId } = validatedFormData.data;
  const existingUserQuiz = await db.query.userQuizzes.findFirst({
    where: eq(userQuizzes.userQuizId, userQuizId),
  });

  if (!existingUserQuiz) {
    return {
      status: "FAILED",
      message: "Unable to delete user's quiz. Try again!",
    };
  }

  if (existingUserQuiz.status === "IN_PROGRESS") {
    return {
      status: "FAILED",
      message: "User is taking this quiz. Try later!",
    };
  }

  const userQuizDeleteQuery = await db
    .update(userQuizzes)
    .set({
      score: 0,
      status: "NOT_STARTED",
      certificateId: null,
    })
    .where(eq(userQuizzes.userQuizId, userQuizId));

  revalidatePath("/admin/users/[userId]", "page");

  if (userQuizDeleteQuery[0].affectedRows > 0) {
    return { status: "SUCCESS", message: "User quiz reset done." };
  }
  return {
    status: "FAILED",
    message: "Unable to reset user's quiz. Try again!",
  };
}

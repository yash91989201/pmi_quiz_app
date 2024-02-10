"use server";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
// UTILS
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/server/utils/mail";
import {
  adminCount,
  getUserByEmail,
  getUserByUserName,
} from "@/server/utils/user";
import {
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
  generateVerificationToken,
  generatePasswordResetToken,
  getVerificationTokenByToken,
  getPasswordResetTokenByToken,
  getTwoFactorConfirmationByUserId,
} from "@/server/utils/token";
import { db } from "@/server/db";
import { signIn, signOut } from "@/server/utils/auth";
// SCHEMAS
import {
  AdminLoginSchema,
  CreateUserFormSchema,
  DeleteUserSchema,
  NewPasswordSchema,
  ResetPasswordSchema,
  SignUpSchema,
  StartUserQuizFormSchema,
  UpdateUserFormSchema,
  UserLoginSchema,
} from "@/lib/schema";
import {
  verificationTokens,
  users,
  twoFactorTokens,
  twoFactorConfimation,
  userQuizzes,
  userOrders,
} from "@/server/db/schema";
// TYPES
import type {
  NewVerificationSchemaType,
  SignUpSchemaType,
  ResetPasswordSchemaType,
  NewPasswordSchemaType,
  CreateUserFormSchemaType,
  DeleteUserSchemaType,
  AdminLoginSchemaType,
  UserLoginSchemaType,
  UserSchemaType,
  UpdateUserFormSchemaType,
  StartUserQuizFormSchemaType,
  UserOrderSchemaType,
} from "@/lib/schema";
// CONSTANTS
import {
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_USER_REDIRECT,
  USER_UPDATE_REDIRECT,
} from "@/config/routes";
import { DUMMY_EMAIL_PREFIX } from "@/config/constants";

export async function adminLogin(
  formData: AdminLoginSchemaType,
): Promise<AdminLoginFormStatusType> {
  const validatedFormData = AdminLoginSchema.safeParse(formData);

  if (!validatedFormData.success) {
    let formFieldErrors: AdminLoginFormErrorsType = {};

    validatedFormData.error.errors.map((error) => {
      formFieldErrors = {
        ...formFieldErrors,
        [`${error.path[0]}`]: error.message,
      };
    });

    return {
      status: "FAILED",
      errors: formFieldErrors,
      message: "Invalid data given.",
    };
  }

  const { email, password, twoFactorCode } = validatedFormData.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser?.email || !existingUser?.password) {
    return {
      status: "FAILED",
      message: "Email does not exist.",
    };
  }

  if (existingUser.emailVerified === null) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
      subject: "Verify your Email.",
      userName: existingUser.name,
    });

    return {
      status: "SUCCESS",
      message: "Confirmation Email Sent.",
      authType: "PASSWORD",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (twoFactorCode) {
      const twoFactorTokenFromEmail = await getTwoFactorTokenByEmail(
        existingUser.email,
      );
      if (!twoFactorTokenFromEmail) {
        return { status: "FAILED", message: "Invalid Code!" };
      }
      if (twoFactorTokenFromEmail.token !== twoFactorCode) {
        return { status: "FAILED", message: "Invalid Code!" };
      }
      const is2FACodeExpired =
        new Date(twoFactorTokenFromEmail.expires) < new Date();
      if (is2FACodeExpired) {
        return { status: "FAILED", message: "2FA Code Expired. Login Again!" };
      }
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, twoFactorTokenFromEmail.id));

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await db
          .delete(twoFactorConfimation)
          .where(eq(twoFactorConfimation.id, existingConfirmation.id));
      }

      await db.insert(twoFactorConfimation).values({
        userId: existingUser.id,
      });
    } else {
      const twoFAToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail({
        email: twoFAToken.email,
        token: twoFAToken.token,
      });
      return {
        status: "SUCCESS",
        message: "2FA code sent to your email",
        authType: "PASSWORD_WITH_2FA",
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_ADMIN_REDIRECT,
    });
    return {
      status: "SUCCESS",
      message: "SignIn Successful.",
      authType: "PASSWORD",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            status: "FAILED",
            message: "Invalid Credentials",
          };
        }
        default: {
          return {
            status: "FAILED",
            message: "Unable to SignIn.",
          };
        }
      }
    }
    throw error;
  }
}

export async function userLogin(
  formData: UserLoginSchemaType,
): Promise<UserLoginFormStatusType> {
  const validatedFormData = UserLoginSchema.safeParse(formData);

  if (!validatedFormData.success) {
    let formFieldErrors: UserLoginFormErrorsType = {};

    validatedFormData.error.errors.map((error) => {
      formFieldErrors = {
        ...formFieldErrors,
        [`${error.path[0]}`]: error.message,
      };
    });

    return {
      status: "FAILED",
      errors: formFieldErrors,
      message: "Invalid data given.",
    };
  }

  let existingUser: UserSchemaType | undefined;
  const { email, password, twoFactorCode, name } = validatedFormData.data;

  if (email) existingUser = await getUserByEmail(email);
  existingUser = await getUserByUserName(name);

  if (!existingUser?.email || !existingUser?.password || !existingUser.name) {
    return {
      status: "FAILED",
      message: "User does not exist.",
    };
  }

  if (existingUser.role === "ADMIN") {
    return { status: "FAILED", message: "You are not authorized!" };
  }

  if (
    existingUser.emailVerified === null &&
    !existingUser.email.startsWith(DUMMY_EMAIL_PREFIX)
  ) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
      subject: "Verify your Email.",
      userName: existingUser.name,
    });

    return {
      status: "SUCCESS",
      message: "Confirmation Email Sent.",
      authType: "PASSWORD",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (twoFactorCode) {
      const twoFactorTokenFromEmail = await getTwoFactorTokenByEmail(
        existingUser.email,
      );
      if (!twoFactorTokenFromEmail) {
        return { status: "FAILED", message: "Invalid Code!" };
      }
      if (twoFactorTokenFromEmail.token !== twoFactorCode) {
        return { status: "FAILED", message: "Invalid Code!" };
      }
      const is2FACodeExpired =
        new Date(twoFactorTokenFromEmail.expires) < new Date();
      if (is2FACodeExpired) {
        return { status: "FAILED", message: "2FA Code Expired. Login Again!" };
      }
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, twoFactorTokenFromEmail.id));

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await db
          .delete(twoFactorConfimation)
          .where(eq(twoFactorConfimation.id, existingConfirmation.id));
      }

      await db.insert(twoFactorConfimation).values({
        userId: existingUser.id,
      });
    } else {
      const twoFAToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail({
        email: twoFAToken.email,
        token: twoFAToken.token,
      });
      return {
        status: "SUCCESS",
        message: "2FA code sent to your email",
        authType: "PASSWORD_WITH_2FA",
      };
    }
  }

  try {
    const redirectTo = email?.startsWith(DUMMY_EMAIL_PREFIX)
      ? USER_UPDATE_REDIRECT
      : DEFAULT_USER_REDIRECT;

    await signIn("credentials", {
      email: existingUser.email,
      password,
      redirectTo,
    });

    return {
      status: "SUCCESS",
      message: "SignIn Successful.",
      authType: "PASSWORD",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            status: "FAILED",
            message: "Invalid Credentials",
          };
        }
        default: {
          return {
            status: "FAILED",
            message: "Unable to SignIn.",
          };
        }
      }
    }
    throw error;
  }
}

export async function newVerification(
  formData: NewVerificationSchemaType,
): Promise<NewVerificationStatusType> {
  const existingToken = await getVerificationTokenByToken(formData.token);
  if (!existingToken) {
    return {
      status: "FAILED",
      message: "Invalid Token.",
    };
  }
  const isTokenExpired = new Date(existingToken.expires) < new Date();
  if (isTokenExpired) {
    return {
      status: "FAILED",
      errors: { token: "Token is Expired. SignIn Again." },
      message: "Token is Expired. SignIn Again.",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      status: "FAILED",
      message: "No user with this email.",
    };
  }
  const updateUserQuery = await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id));

  if (updateUserQuery[0].affectedRows === 1) {
    return {
      status: "SUCCESS",
      message: "SignUp Confirmed.",
      role: existingUser.role,
    };
  }

  return {
    status: "FAILED",
    message: "Some error occourred. Please try again.",
  };
}

export async function signUp(
  formData: SignUpSchemaType,
): Promise<SignUpFormStatusType> {
  const validatedFormData = SignUpSchema.safeParse(formData);

  if (!validatedFormData.success) {
    let formFieldErrors: SignUpFormErrorsType = {};

    validatedFormData.error.errors.map((error) => {
      formFieldErrors = {
        ...formFieldErrors,
        [`${error.path[0]}`]: error.message,
      };
    });

    return {
      status: "FAILED",
      errors: formFieldErrors,
      message: "Invalid Credentials",
    };
  }

  const { name, email, password } = validatedFormData.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      status: "FAILED",
      errors: { email: "Email already in use." },
      message: "Email already in use.",
    };
  }

  const numberOfAdmins = await adminCount();
  const hashedPassword = await bcrypt.hash(password, 12);

  if (numberOfAdmins === 0) {
    const createNewUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: numberOfAdmins === 0 ? "ADMIN" : "USER",
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail({
      userName: name,
      email: verificationToken.email,
      token: verificationToken.token,
      subject: "Confirm your SignUp.",
    });

    if (createNewUser[0].affectedRows === 1) {
      return {
        status: "SUCCESS",
        message: "Confirmation Email Sent.",
      };
    }
  }

  return {
    status: "FAILED",
    message: "Admin user already exists.",
  };
}

export async function resetPassword(
  formData: ResetPasswordSchemaType,
): Promise<ResetPasswordStatusType> {
  const validatedFormData = ResetPasswordSchema.safeParse(formData);
  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Password reset failed.",
    };
  }

  const existingUser = await getUserByEmail(validatedFormData.data.email);

  if (!existingUser) {
    return {
      status: "FAILED",
      message: "Email doesnot exists.",
    };
  }

  const resetToken = await generatePasswordResetToken(existingUser.email);

  await sendPasswordResetEmail({
    email: existingUser.email,
    token: resetToken.token,
  });

  return {
    status: "SUCCESS",
    message: "Check your inbox for reset mail.",
  };
}

export async function newPassword(
  formData: NewPasswordSchemaType,
): Promise<NewPasswordStatusType> {
  const validatedFormData = NewPasswordSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Invalid data given.",
    };
  }

  const { password, token } = validatedFormData.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { status: "FAILED", message: "Token is invalid." };
  }

  const isResetTokenExpired = new Date(existingToken.expires) < new Date();

  if (isResetTokenExpired) {
    return { status: "FAILED", message: "Token has expired." };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      status: "FAILED",
      message: "User doesnot exists.",
    };
  }

  const newPassword = await bcrypt.hash(password, 12);

  const newPasswordQuery = await db
    .update(users)
    .set({
      password: newPassword,
    })
    .where(eq(users.id, existingUser.id));

  if (newPasswordQuery[0].affectedRows > 0) {
    return {
      status: "SUCCESS",
      message: "Password reset done.",
      role: existingUser.role,
    };
  }
  return { status: "FAILED", message: "Unable to reset password, try again." };
}

export async function logoutUser() {
  await signOut();
}

export async function createNewUser(
  formData: CreateUserFormSchemaType,
): Promise<CreateUsesrFormStatusType> {
  const validatedFormData = CreateUserFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    let formFieldErrors: CreateNewUserFormErrorsType = {};

    validatedFormData.error.errors.map((error) => {
      formFieldErrors = {
        ...formFieldErrors,
        [`${error.path[0]}`]: error.message,
      };
    });

    return {
      status: "FAILED",
      errors: formFieldErrors,
      message: "Invalid data given.",
    };
  }

  const existingUser = await getUserByUserName(validatedFormData.data.name);

  if (existingUser) {
    return {
      status: "FAILED",
      errors: {
        name: "User with this username already exists.",
      },
      message: "User with this username already exists.",
    };
  }

  const { email, name, password, quizzesId, orders } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 12);

  //  create user with ROLE user
  const newUser = await db.insert(users).values({
    email,
    name,
    password: hashedPassword,
    role: "USER",
  });

  // user the quizIds to create new record in userQuiz table
  const createdUser = await getUserByEmail(email);
  if (!createdUser) {
    return {
      status: "FAILED",
      message: "Unable to create user, please try again.",
    };
  }

  if (quizzesId.length > 0) {
    const allQuizzes = await db.query.quizzes.findMany();

    const quizzesSelectedForUser = quizzesId.map((quizId) => {
      const { quizTitle, totalMark } = allQuizzes.find(
        (quiz) => quiz.quizId === quizId,
      )!;

      return {
        userId: createdUser?.id,
        quizId,
        quizTitle,
        totalMark,
      };
    });

    const newUserQuizzes = await db
      .insert(userQuizzes)
      .values(quizzesSelectedForUser);

    if (newUser[0].affectedRows > 0 && newUserQuizzes[0].affectedRows > 0) {
      return {
        status: "SUCCESS",
        message: "User Created, quizzes and orders added successfully.",
      };
    }
  }

  if (orders.length > 0) {
    const createdUserOrders = orders.map((order) => ({
      ...order,
      userId: createdUser.id,
    }));

    await db.insert(userOrders).values(createdUserOrders);
  }
  revalidatePath("/admin/users");

  if (newUser[0].affectedRows > 0) {
    return {
      status: "SUCCESS",
      message: "User Created Successfully.",
    };
  }

  return {
    status: "FAILED",
    message: "Unable to create user, please try again.",
  };
}

export async function updateUser(
  formData: UpdateUserFormSchemaType,
): Promise<UpdateUserFormStatusType> {
  const validatedFormData = UpdateUserFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return { status: "FAILED", message: "Unable to update user." };
  }

  const {
    id,
    name,
    email,
    password,
    quizzesId: updatedUserQuizzesId,
    orders: updatedUserOrders,
  } = validatedFormData.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  const allQuizzesData = await db.query.quizzes.findMany();

  const existingUserQuizzes = await db.query.userQuizzes.findMany({
    where: eq(userQuizzes.userId, id),
  });

  const existingUserOrders = await db.query.userOrders.findMany({
    where: eq(userOrders.userId, id),
  });

  const existingUserOrdersId = existingUserOrders.map(
    (existingUserOrder) => existingUserOrder.userOrderId,
  );

  const inProgressQuizzesId = existingUserQuizzes
    .filter((userQuiz) => userQuiz.status === "IN_PROGRESS")
    .map((userQuiz) => userQuiz.quizId);

  const existingUserQuizzesId = existingUserQuizzes.map(
    (existingUserQuiz) => existingUserQuiz.quizId,
  );

  if (!existingUser) {
    return { status: "FAILED", message: "User doesnot exists." };
  }

  const newPassword = await bcrypt.hash(password, 12);

  const isUserDataUpdated =
    email !== existingUser.email || name !== existingUser.name;

  const addedQuizzesId: string[] = [];
  const deletedQuizzesId: string[] = [];
  const addedUserOrders: UserOrderSchemaType[] = [];
  const updateOrdersId: string[] = [];
  const deletedUserOrdersId: string[] = [];

  /*
  if a user quiz from existing list is not in updated list
  then that user quiz was removed
  */
  existingUserQuizzesId.forEach((existingUserQuizId) => {
    if (inProgressQuizzesId.includes(existingUserQuizId)) return;
    if (!updatedUserQuizzesId.includes(existingUserQuizId))
      deletedQuizzesId.push(existingUserQuizId);
  });

  /*
  if a user quiz from updated list is not in existing list 
  then that user quiz was added 
  */
  updatedUserQuizzesId.forEach((updatedUserQuizId) => {
    if (!existingUserQuizzesId.includes(updatedUserQuizId))
      addedQuizzesId.push(updatedUserQuizId);
  });

  /*
  if a user quiz from existing list is not in updated list
  then that user quiz was removed
  */
  existingUserOrders.forEach((existingUserOrder) => {
    const updatedUserOrder = updatedUserOrders.find(
      (updatedUserOrder) =>
        updatedUserOrder.userOrderId === existingUserOrder.userOrderId,
    );
    if (updatedUserOrder === undefined) {
      deletedUserOrdersId.push(existingUserOrder.userOrderId);
      return;
    }

    if (
      updatedUserOrder.orderText !== existingUserOrder.orderText ||
      updatedUserOrder.isCompleted !== existingUserOrder.isCompleted ||
      updatedUserOrder.orderPriority !== existingUserOrder.orderPriority
    ) {
      updateOrdersId.push(existingUserOrder.userOrderId);
    }
  });

  /*
  if a user order from updated list is not in existing list 
  then that user order was added 
  */
  updatedUserOrders.forEach((updatedUserOrder) => {
    if (!existingUserOrdersId.includes(updatedUserOrder.userOrderId))
      addedUserOrders.push(updatedUserOrder);
  });

  let updateUserStatus: UpdateUserFormStatusType = {
    status: "SUCCESS",
    message: "User Update Done",
    user: {},
    quizzes: {},
    orders: {},
  };

  if (isUserDataUpdated) {
    const updateUserQuery = await db
      .update(users)
      .set({
        name,
        email,
        password: newPassword,
      })
      .where(eq(users.id, id));

    const userUpdateSuccess = updateUserQuery[0].affectedRows > 0;
    updateUserStatus = {
      ...updateUserStatus,
      user: {
        ...updateUserStatus.user,
        update: {
          status: userUpdateSuccess ? "SUCCESS" : "FAILED",
          message: userUpdateSuccess
            ? "User updated successfully."
            : "Unable to update user. Try again!",
        },
      },
    };
  }

  if (addedQuizzesId.length > 0) {
    const userQuizzesInsertQuery = await Promise.all(
      addedQuizzesId.map(async (addedQuizId) => {
        const quizData = allQuizzesData.find(
          (quizData) => quizData.quizId === addedQuizId,
        )!;

        const userQuizInsertQuery = await db.insert(userQuizzes).values({
          quizId: quizData.quizId,
          quizTitle: quizData.quizTitle,
          totalMark: quizData.totalMark,
          userId: id,
        });
        return userQuizInsertQuery[0];
      }),
    );
    const userQuizzesInsertSuccess = userQuizzesInsertQuery.every(
      (userQuizInsertQuery) => userQuizInsertQuery.affectedRows > 0,
    );

    updateUserStatus = {
      ...updateUserStatus,
      quizzes: {
        ...updateUserStatus.quizzes,
        insert: {
          status: userQuizzesInsertSuccess ? "SUCCESS" : "FAILED",
          message: userQuizzesInsertSuccess
            ? "New quiz/s added successfully."
            : "Unable to add new quiz/s. Try again!",
        },
      },
    };
  }

  if (deletedQuizzesId.length > 0) {
    const userQuizzesDeleteQuery = await Promise.all(
      deletedQuizzesId.map(async (deletedQuizId) => {
        const userQuizDeleteQuery = await db
          .delete(userQuizzes)
          .where(
            and(
              eq(userQuizzes.quizId, deletedQuizId),
              eq(userQuizzes.userId, id),
            ),
          );
        return userQuizDeleteQuery[0];
      }),
    );

    const userQuizzesDeleteSuccess = userQuizzesDeleteQuery.every(
      (userQuizDeleteQuery) => userQuizDeleteQuery.affectedRows > 0,
    );
    updateUserStatus = {
      ...updateUserStatus,
      quizzes: {
        ...updateUserStatus.quizzes,
        delete: {
          status: userQuizzesDeleteSuccess ? "SUCCESS" : "FAILED",
          message: userQuizzesDeleteSuccess
            ? "User quizzes deleted successfully."
            : "Unable to delete user quiz/s. Try again!",
        },
      },
    };
  }

  if (addedUserOrders.length > 0) {
    const userOrdersInsertQuery = await db
      .insert(userOrders)
      .values(addedUserOrders);

    const userOrderInsertSuccess =
      userOrdersInsertQuery[0].affectedRows === addedUserOrders.length;
    updateUserStatus = {
      ...updateUserStatus,
      orders: {
        ...updateUserStatus.orders,
        insert: {
          status: userOrderInsertSuccess ? "SUCCESS" : "FAILED",
          message: userOrderInsertSuccess
            ? "User order added successfully."
            : "Unable to add user order. Try again!",
        },
      },
    };
  }

  if (updateOrdersId.length > 0) {
    const userOrdersUpdateQuery = await Promise.all(
      updateOrdersId.map(async (updatedOrderId) => {
        const { isCompleted, orderPriority, orderText } =
          updatedUserOrders.find(
            (updatedUserOrder) =>
              updatedUserOrder.userOrderId === updatedOrderId,
          )!;

        const updateUserOrderQuery = await db
          .update(userOrders)
          .set({
            isCompleted,
            orderPriority,
            orderText,
          })
          .where(eq(userOrders.userOrderId, updatedOrderId));
        return updateUserOrderQuery[0];
      }),
    );

    const ordersUpdateSuccess = userOrdersUpdateQuery.every(
      (userOrderUpdateQuery) => userOrderUpdateQuery.affectedRows > 0,
    );

    updateUserStatus = {
      ...updateUserStatus,
      orders: {
        ...updateUserStatus.orders,
        update: {
          status: ordersUpdateSuccess ? "SUCCESS" : "FAILED",
          message: ordersUpdateSuccess
            ? "User order updated successfully."
            : "Unable to update user order. Try again!",
        },
      },
    };
  }

  if (deletedUserOrdersId.length > 0) {
    const userOrdersDeleteQuery = await Promise.all(
      deletedUserOrdersId.map(async (deletedUserOrderId) => {
        const userOrderDeleteQuery = await db
          .delete(userOrders)
          .where(eq(userOrders.userOrderId, deletedUserOrderId));
        return userOrderDeleteQuery[0];
      }),
    );

    const userOrdersDeleteSuccess = userOrdersDeleteQuery.every(
      (userOrderDeleteQuery) => userOrderDeleteQuery.affectedRows > 0,
    );

    updateUserStatus = {
      ...updateUserStatus,
      orders: {
        ...updateUserStatus.orders,
        delete: {
          status: userOrdersDeleteSuccess ? "SUCCESS" : "FAILED",
          message: userOrdersDeleteSuccess
            ? "User order deleted successfully."
            : "Unable to delete user order. Try again!",
        },
      },
    };
  }

  revalidatePath("/admin/users/[userId]", "page");

  return updateUserStatus;
}

export async function deleteUser(
  formData: DeleteUserSchemaType,
): Promise<DeleteUserFormStatusType> {
  const validatedFormData = DeleteUserSchema.safeParse(formData);
  if (!validatedFormData.success) {
    let formFieldErrors: DeleteUserFormErrorsType = {};

    validatedFormData.error.errors.map((error) => {
      formFieldErrors = {
        ...formFieldErrors,
        [`${error.path[0]}`]: error.message,
      };
    });

    return {
      status: "FAILED",
      errors: formFieldErrors,
      message: "Invalid data given.",
    };
  }

  const isUserNotTakingAnyQuiz =
    (
      await db.query.userQuizzes.findMany({
        where: and(
          eq(userQuizzes.userId, validatedFormData.data.id),
          eq(userQuizzes.status, "IN_PROGRESS"),
        ),
      })
    ).length === 0;

  if (isUserNotTakingAnyQuiz) {
    const deleteUserQuery = await db
      .delete(users)
      .where(eq(users.id, validatedFormData.data.id));

    revalidatePath("/admin/users");
    if (deleteUserQuery[0].affectedRows === 1) {
      return { status: "SUCCESS", message: "User deleted successfully." };
    }
    return {
      status: "FAILED",
      message: "Unable to delete user, try again.",
    };
  }

  return {
    status: "FAILED",
    message: "Cannot delete user while taking quiz.",
  };
}

export async function startUserQuiz(
  formData: StartUserQuizFormSchemaType,
): Promise<StartUserQuizFormStatusType> {
  const validatedFormData = StartUserQuizFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Unable to start exam.",
    };
  }

  const startUserQuizQuery = await db
    .update(userQuizzes)
    .set({
      status: "IN_PROGRESS",
    })
    .where(eq(userQuizzes.userQuizId, validatedFormData.data.userQuizId));

  revalidatePath("/(user)", "layout");

  if (startUserQuizQuery[0].affectedRows > 0) {
    return {
      status: "SUCCESS",
      message: "Quiz started",
    };
  }

  return {
    status: "FAILED",
    message: "Unable to start exam. Try Again!",
  };
}

export async function updateCertificate({
  certificateId,
  userQuizId,
}: {
  certificateId: string;
  userQuizId: string;
}): Promise<{ status: "SUCCESS" | "FAILED"; message: string }> {
  const updateCertificateQuery = await db
    .update(userQuizzes)
    .set({ certificateId })
    .where(eq(userQuizzes.userQuizId, userQuizId));

  revalidatePath("/admin/users/userId", "page");

  if (updateCertificateQuery[0].affectedRows > 0) {
    return { status: "SUCCESS", message: "User's quiz certificate updated" };
  }
  return {
    status: "FAILED",
    message: "Unable to update certificate try again.",
  };
}

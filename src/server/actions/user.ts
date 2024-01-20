"use server";
import { and, eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
// UTILS
import { db } from "@/server/db";
import { signIn, signOut } from "@/server/utils/auth";
import {
  adminCount,
  getUserByEmail,
  getUserByUserName,
} from "@/server/utils/user";
import {
  generatePasswordResetToken,
  generateVerificationToken,
  getPasswordResetTokenByToken,
  getVerificationTokenByToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
  getTwoFactorConfirmationByUserId,
} from "@/server/utils/token";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/server/utils/mail";
// SCHEMAS
import {
  verificationTokens,
  users,
  twoFactorTokens,
  twoFactorConfimation,
  userQuizzes,
} from "@/server/db/schema";
import {
  CreateNewUserSchema,
  DeleteUserSchema,
  LoginSchema,
  NewPasswordSchema,
  ResetPasswordSchema,
  SignUpSchema,
} from "@/lib/schema";
// TYPES
import type {
  NewVerificationSchemaType,
  LoginSchemaType,
  SignUpSchemaType,
  ResetPasswordSchemaType,
  NewPasswordSchemaType,
  CreateNewUserSchemaType,
  DeleteUserSchemaType,
} from "@/lib/schema";
// CONSTANTS
import { DEFAULT_ADMIN_REDIRECT } from "@/config/routes";

async function login(formData: LoginSchemaType): Promise<LoginFormStatusType> {
  const validatedFormData = LoginSchema.safeParse(formData);

  if (!validatedFormData.success) {
    let formFieldErrors: LoginFormErrorsType = {};

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

async function newVerification(
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
    return { status: "SUCCESS", message: "SignUp Confirmed." };
  }

  return {
    status: "FAILED",
    message: "Some error occourred. Please try again.",
  };
}

async function signUp(
  formData: SignUpSchemaType,
): Promise<SignUpFormStatusType> {
  const validatedFormData = SignUpSchema.safeParse(formData);

  if (!validatedFormData.success) {
    let formFieldErrors: LoginFormErrorsType = {};

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

  return {
    status: "FAILED",
    message: "Error Occured! Try again.",
  };
}

async function resetPassword(
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

  return { status: "SUCCESS", message: "Check your inbox for reset mail." };
}

async function newPassword(
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
    return { status: "FAILED", message: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      status: "FAILED",
      message: "User doesnot exists",
    };
  }

  const newPassword = await bcrypt.hash(password, 12);
  console.log(newPassword);

  await db
    .update(users)
    .set({
      password: newPassword,
    })
    .where(eq(users.id, existingToken.id));

  return { status: "SUCCESS", message: "Password reset done." };
}

async function logoutUser() {
  await signOut();
}

async function createNewUser(
  formData: CreateNewUserSchemaType,
): Promise<CreateNewUserFormStatusType> {
  const validatedFormData = CreateNewUserSchema.safeParse(formData);

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
      message: "Unable to create user.",
    };
  }

  const { email, name, password, quizzes } = validatedFormData.data;
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
  const quizzesSelectedForUser = quizzes.map((quiz) => ({
    quizId: quiz,
    userId: createdUser?.id,
  }));

  const newUserQuizzes = await db
    .insert(userQuizzes)
    .values(quizzesSelectedForUser);

  if (newUser[0].affectedRows == 1 && newUserQuizzes[0].affectedRows >= 1) {
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

async function deleteUser(
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

export {
  login,
  newVerification,
  signUp,
  logoutUser,
  resetPassword,
  newPassword,
  // actions for ROLE == USER
  createNewUser,
  deleteUser,
};

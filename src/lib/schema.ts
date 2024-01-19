import * as z from "zod";
import { createSelectSchema } from "drizzle-zod";
// DB SCHEMAS
import {
  passwordResetTokens,
  questions,
  quizzes,
  twoFactorConfimation,
  twoFactorTokens,
  userQuizzes,
  users,
  verificationTokens,
  options,
} from "@/server/db/schema";

// NON-ACTION SCHEMAS
const UserSchema = createSelectSchema(users);
const QuizSchema = createSelectSchema(quizzes);
const QuestionSchema = createSelectSchema(questions);
const OptionSchema = createSelectSchema(options);
const UserQuizSchema = createSelectSchema(userQuizzes);
const VerficationTokenSchema = createSelectSchema(verificationTokens);
const PasswordResetTokenSchema = createSelectSchema(passwordResetTokens);
const TwoFactorTokenSchema = createSelectSchema(twoFactorTokens);
const TwoFactorConfirmationSchema = createSelectSchema(twoFactorConfimation);

// ACTION SCHEMAS
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  twoFactorCode: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

const SignUpSchema = z.object({
  userName: z.string().min(6, { message: "Full name is required." }),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

const NewVerificationSchema = z.object({
  token: z.string(),
});

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

const NewPasswordSchema = z.object({
  password: z.string(),
  token: z.string(),
});

const CreateNewUserSchema = z.object({
  userName: z.string().min(6, { message: "Full name is required." }),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

const DeleteUserSchema = z.object({
  id: z.string(),
});

// NON-ACTION SCHEMA TYPES
type UserSchemaType = z.infer<typeof UserSchema>;
type QuizSchemaType = z.infer<typeof QuizSchema>;
type QuestionSchemaType = z.infer<typeof QuestionSchema>;
type OptionSchemaType = z.infer<typeof OptionSchema>;
type UserQuizSchemaType = z.infer<typeof UserQuizSchema>;
type VerficationTokenSchemaType = z.infer<typeof VerficationTokenSchema>;
type PasswordResetTokenSchemaType = z.infer<typeof PasswordResetTokenSchema>;
type TwoFactorTokenSchemaType = z.infer<typeof TwoFactorTokenSchema>;
type TwoFactorConfirmationSchemaType = z.infer<
  typeof TwoFactorConfirmationSchema
>;

// ACTION SCHEM
type LoginSchemaType = z.infer<typeof LoginSchema>;
type SignUpSchemaType = z.infer<typeof SignUpSchema>;
type NewVerificationSchemaType = z.infer<typeof NewVerificationSchema>;
type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
type CreateNewUserSchemaType = z.infer<typeof CreateNewUserSchema>;
type DeleteUserSchemaType = z.infer<typeof DeleteUserSchema>;

export {
  // NON-ACTION SCHEMAS
  UserSchema,
  QuizSchema,
  QuestionSchema,
  OptionSchema,
  UserQuizSchema,
  VerficationTokenSchema,
  PasswordResetTokenSchema,
  TwoFactorTokenSchema,
  TwoFactorConfirmationSchema,
  // ACTION SCHEMAS
  LoginSchema,
  SignUpSchema,
  NewVerificationSchema,
  ResetPasswordSchema,
  NewPasswordSchema,
  CreateNewUserSchema,
  DeleteUserSchema,
};

export type {
  // NON-ACTION SCHEMA TYPES
  UserSchemaType,
  QuizSchemaType,
  QuestionSchemaType,
  OptionSchemaType,
  UserQuizSchemaType,
  VerficationTokenSchemaType,
  PasswordResetTokenSchemaType,
  TwoFactorTokenSchemaType,
  TwoFactorConfirmationSchemaType,
  // ACTION SCHEMA TYPES
  LoginSchemaType,
  SignUpSchemaType,
  NewVerificationSchemaType,
  ResetPasswordSchemaType,
  NewPasswordSchemaType,
  CreateNewUserSchemaType,
  DeleteUserSchemaType,
};

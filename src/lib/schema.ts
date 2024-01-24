import * as z from "zod";
import { createSelectSchema } from "drizzle-zod";
// SCHEMAS
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
const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  twoFactorCode: z.string().optional(),
  role: z.literal("ADMIN"),
});

const UserLoginSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  password: z.string(),
  twoFactorCode: z.string().optional(),
  role: z.literal("USER"),
});

const AuthorizeLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const SignUpSchema = z.object({
  name: z.string().min(6, { message: "Full name is required." }),
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
  name: z.string().min(6, { message: "Full name is required." }),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  quizzesId: z.array(z.string()).default([]),
});

const DeleteUserSchema = z.object({
  id: z.string(),
});

const OptionsSchema = z.object({
  optionId: z.string(),
  questionId: z.string(),
  optionText: z.string().min(1, { message: "Option Text is required." }),
  isCorrectOption: z.boolean(),
});

const QuestionsSchema = z.object({
  questionId: z.string(),
  quizId: z.string(),
  questionText: z.string().min(1, { message: "Question Text is required." }),
  mark: z.number().min(1, { message: "Min. mark is 1" }),
  options: z.array(OptionsSchema),
});

const QuizFormSchema = z.object({
  quizId: z.string(),
  quizTitle: z.string().min(1, { message: "Quiz Name is required" }),
  totalMark: z.number(),
  usersId: z.array(z.string()).default([]),
  questions: z.array(QuestionsSchema),
});

const UserOptionsSchema = z.object({
  optionId: z.string(),
  questionId: z.string(),
  optionText: z.string().min(1, { message: "Option Text is required." }),
  isSelected: z.boolean(),
});

const UserQuestionsSchema = z.object({
  questionId: z.string(),
  quizId: z.string(),
  questionText: z.string(),
  mark: z.number(),
  options: z.array(UserOptionsSchema),
});

const UserQuizFormSchema = z.object({
  quizId: z.string(),
  userQuizId: z.string(),
  questions: z.array(UserQuestionsSchema),
});

const DeleteQuizFormSchema = z.object({
  quizId: z.string(),
});

// NON-ACTION SCHEMA TYPES
type UserSchemaType = z.infer<typeof UserSchema>;
type QuizSchemaType = z.infer<typeof QuizSchema>;
type QuestionSchemaType = z.infer<typeof QuestionSchema>;
type OptionSchemaType = z.infer<typeof OptionSchema>;
type UserQuizSchemaType = z.infer<typeof UserQuizSchema>;
type UserQuizStatusType = UserQuizSchemaType["status"];
type VerficationTokenSchemaType = z.infer<typeof VerficationTokenSchema>;
type PasswordResetTokenSchemaType = z.infer<typeof PasswordResetTokenSchema>;
type TwoFactorTokenSchemaType = z.infer<typeof TwoFactorTokenSchema>;
type TwoFactorConfirmationSchemaType = z.infer<
  typeof TwoFactorConfirmationSchema
>;
type QuizTableSchemaType = QuizSchemaType & {
  totalQuestions: number;
  totalUsers: number;
};

// ACTION SCHEMA TYPES
type AdminLoginSchemaType = z.infer<typeof AdminLoginSchema>;
type UserLoginSchemaType = z.infer<typeof UserLoginSchema>;
type SignUpSchemaType = z.infer<typeof SignUpSchema>;
type NewVerificationSchemaType = z.infer<typeof NewVerificationSchema>;
type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
type CreateNewUserSchemaType = z.infer<typeof CreateNewUserSchema>;
type DeleteUserSchemaType = z.infer<typeof DeleteUserSchema>;
type QuizFormSchemaType = z.infer<typeof QuizFormSchema>;
type UserQuizFormSchemaType = z.infer<typeof UserQuizFormSchema>;
type DeleteQuizFormSchemaType = z.infer<typeof DeleteQuizFormSchema>;
type QuestionsSchemaType = z.infer<typeof QuestionsSchema>;
type OptionsSchemaType = z.infer<typeof OptionsSchema>;

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
  AdminLoginSchema,
  UserLoginSchema,
  AuthorizeLoginSchema,
  SignUpSchema,
  NewVerificationSchema,
  ResetPasswordSchema,
  NewPasswordSchema,
  CreateNewUserSchema,
  DeleteUserSchema,
  QuizFormSchema,
  UserQuizFormSchema,
  DeleteQuizFormSchema,
  QuestionsSchema,
  OptionsSchema,
};

export type {
  // NON-ACTION SCHEMA TYPES
  UserSchemaType,
  QuizSchemaType,
  QuestionSchemaType,
  OptionSchemaType,
  UserQuizSchemaType,
  UserQuizStatusType,
  VerficationTokenSchemaType,
  PasswordResetTokenSchemaType,
  TwoFactorTokenSchemaType,
  TwoFactorConfirmationSchemaType,
  QuizTableSchemaType,
  // ACTION SCHEMA TYPES
  AdminLoginSchemaType,
  UserLoginSchemaType,
  SignUpSchemaType,
  NewVerificationSchemaType,
  ResetPasswordSchemaType,
  NewPasswordSchemaType,
  CreateNewUserSchemaType,
  DeleteUserSchemaType,
  QuizFormSchemaType,
  DeleteQuizFormSchemaType,
  QuestionsSchemaType,
  OptionsSchemaType,
  UserQuizFormSchemaType,
};

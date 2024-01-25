import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  mysqlEnum,
  boolean,
} from "drizzle-orm/mysql-core";

export const mysqlTable = mysqlTableCreator((name) => name);

export const users = mysqlTable("users", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 32 }).notNull().unique(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  role: mysqlEnum("role", ["ADMIN", "USER"]).default("USER").notNull(),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").notNull().default(false),
  image: varchar("image", { length: 255 }),
});

export const quizzes = mysqlTable("quizzes", {
  quizId: varchar("quizId", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  quizTitle: varchar("quizTitle", { length: 32 }).notNull(),
  totalMark: int("totalMark").notNull(),
});

export const questions = mysqlTable("questions", {
  questionId: varchar("questionId", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  quizId: varchar("quizId", { length: 32 })
    .notNull()
    .references(() => quizzes.quizId, {
      onDelete: "cascade",
    }),
  questionText: text("questionText").notNull(),
  mark: int("mark").notNull(),
});

export const questionRelations = relations(questions, ({ many }) => ({
  options: many(options),
}));

export const options = mysqlTable("options", {
  optionId: varchar("optionId", { length: 32 }).primaryKey(),
  questionId: varchar("questionId", { length: 32 })
    .notNull()
    .references(() => questions.questionId, {
      onDelete: "cascade",
    }),
  optionText: varchar("optionText", { length: 255 }).notNull(),
  isCorrectOption: boolean("isCorrectOption").default(false).notNull(),
});

export const optionRelations = relations(options, ({ one }) => ({
  questions: one(questions, {
    fields: [options.questionId],
    references: [questions.questionId],
  }),
}));

export const userQuizzes = mysqlTable("userQuizzes", {
  userQuizId: varchar("userQuizId", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("userId", { length: 32 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  quizId: varchar("quizId", { length: 32 })
    .notNull()
    .references(() => quizzes.quizId, {
      onDelete: "cascade",
    }),
  quizTitle: varchar("quizTitle", { length: 32 }).notNull(),
  totalMark: int("totalMark").notNull(),
  score: int("score").default(0).notNull(),
  status: mysqlEnum("status", ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"])
    .default("NOT_STARTED")
    .notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationTokens",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .$defaultFn(() => createId()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  }),
);

export const passwordResetTokens = mysqlTable(
  "passwordResetTokens",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .$defaultFn(() => createId()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (prt) => ({
    compoundKey: primaryKey({ columns: [prt.id, prt.token] }),
  }),
);

export const twoFactorTokens = mysqlTable(
  "twoFactorTokens",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .$defaultFn(() => createId()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (tft) => ({
    compoundKey: primaryKey({ columns: [tft.id, tft.token] }),
  }),
);

export const twoFactorConfimation = mysqlTable("twoFactorConfimation", {
  id: varchar("id", { length: 255 })
    .notNull()
    .$defaultFn(() => createId()),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});

import { createId } from "@paralleldrive/cuid2";
import {
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  mysqlEnum,
  boolean,
} from "drizzle-orm/mysql-core";

export const mysqlTable = mysqlTableCreator((name) => `pmi_quiz_app_${name}`);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 32 }),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  role: mysqlEnum("role", ["ADMIN", "USER"]).default("USER"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").notNull().default(false),
  image: varchar("image", { length: 255 }),
});

export const quizzes = mysqlTable("quiz", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 32 }),
  totalMark: int("totalMarks"),
});

export const questions = mysqlTable("question", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => createId()),
  quizId: varchar("quizId", { length: 32 })
    .notNull()
    .references(() => quizzes.id, {
      onDelete: "cascade",
    }),
  questionText: text("questionText"),
  mark: int("mark"),
});

export const options = mysqlTable(
  "option",
  {
    quizId: varchar("quizId", { length: 32 }).notNull(),
    questionId: varchar("questionId", { length: 32 })
      .notNull()
      .references(() => questions.id, {
        onDelete: "cascade",
      }),
    optionText: varchar("optionText", { length: 255 }),
    isCorrectOption: boolean("isCorrectOption").default(false),
  },
  (table) => {
    return {
      compositeKey: primaryKey({
        name: "id",
        columns: [table.quizId, table.questionId],
      }),
      questionIdIdx: index("questionId_Idx").on(table.questionId),
    };
  },
);

export const userQuizzes = mysqlTable(
  "userQuiz",
  {
    userId: varchar("userId", { length: 32 }).notNull(),
    quizId: varchar("quizId", { length: 32 })
      .notNull()
      .unique()
      .references(() => quizzes.id, {
        onDelete: "cascade",
      }),
    score: int("score"),
    status: mysqlEnum("status", [
      "NOT_STARTED",
      "IN_PROGRESS",
      "COMPLETED",
    ]).default("NOT_STARTED"),
  },
  (table) => {
    return {
      compositeKey: primaryKey({
        name: "id",
        columns: [table.quizId, table.userId],
      }),
      quizIdIdx: index("quizId_Idx").on(table.quizId),
      userIdIdx: index("userId_Idx").on(table.userId),
    };
  },
);

export const verificationTokens = mysqlTable(
  "verificationToken",
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

export const passwordResetToken = mysqlTable(
  "passwordResetToken",
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

export const twoFactorToken = mysqlTable(
  "twoFactorToken",
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

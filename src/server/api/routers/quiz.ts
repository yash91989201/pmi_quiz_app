import z from "zod";
import { asc, count, countDistinct, eq, like } from "drizzle-orm";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// SCHEMAS
import {
  options,
  questions,
  quizzes,
  userQuizzes,
  users,
} from "@/server/db/schema";

const quizRouter = createTRPCRouter({
  /**
   * Returns all the quizzes created
   * used for display in quiz table
   * only for use in ADMIN side.
   */
  getAll: protectedProcedure
    .input(
      z.object({
        query: z.string().optional().default(""),
        page: z.number().optional(),
        per_page: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let quizzesQuery;
      const { query, page = 0, per_page = 0 } = input;

      if (query.length === 0) {
        quizzesQuery = ctx.db
          .select({
            quizId: quizzes.quizId,
            quizTitle: quizzes.quizTitle,
            totalMark: quizzes.totalMark,
            totalQuestions: count(questions.questionId),
            totalUsers: countDistinct(userQuizzes.quizId),
          })
          .from(quizzes)
          .leftJoin(questions, eq(quizzes.quizId, questions.quizId))
          .leftJoin(userQuizzes, eq(quizzes.quizId, userQuizzes.quizId))
          .groupBy(quizzes.quizId, quizzes.quizTitle, quizzes.totalMark)
          .prepare();
      } else {
        quizzesQuery = ctx.db
          .select({
            quizId: quizzes.quizId,
            quizTitle: quizzes.quizTitle,
            totalMark: quizzes.totalMark,
            totalQuestions: countDistinct(questions.questionId),
            totalUsers: countDistinct(userQuizzes.quizId),
          })
          .from(quizzes)
          .leftJoin(questions, eq(quizzes.quizId, questions.quizId))
          .leftJoin(userQuizzes, eq(quizzes.quizId, userQuizzes.quizId))
          .where(like(quizzes.quizTitle, `%${query.toLowerCase()}%`))
          .groupBy(quizzes.quizId, quizzes.quizTitle, quizzes.totalMark)
          .prepare();
      }

      const fetchedQuizzes = await quizzesQuery.execute();

      // pagination logic
      if (page > 0 && per_page > 0) {
        const start = (page - 1) * per_page;
        const end = start + per_page;
        const paginatedQuizzesData =
          fetchedQuizzes.length < per_page
            ? fetchedQuizzes
            : fetchedQuizzes.slice(start, end);

        return {
          quizzes: paginatedQuizzesData,
          hasPreviousPage: start > 0,
          hasNextPage: end < fetchedQuizzes.length,
          total_page: Math.ceil(fetchedQuizzes.length / per_page),
        };
      }

      return {
        quizzes: fetchedQuizzes,
        hasPreviousPage: false,
        hasNextPage: false,
        total_page: 0,
      };
    }),
  /**
   * Returns all the quizzes
   * to be used to add quiz to a user
   * only for use in ADMIN side.
   */
  getQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.quizzes.findMany({
      columns: {
        quizId: true,
        quizTitle: true,
      },
    });
  }),
  /**
   * Returns all the quizzes for a specific user id
   * used to show quiz results for a specific user
   * only for use in ADMIN side.
   */
  getUserQuizzes: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.userQuizzes.findMany({
        where: eq(userQuizzes.userId, input.userId),
      });
    }),
  /**
   * Returns  user quizzes for a specific quiz id
   * used to show quiz results for a specific quiz
   * only for use in ADMIN side.
   */
  getUsersQuizzes: protectedProcedure
    .input(z.object({ quizId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          userQuizId: userQuizzes.userQuizId,
          userId: userQuizzes.userId,
          quizId: userQuizzes.quizId,
          name: users.name,
          score: userQuizzes.score,
          status: userQuizzes.status,
          quizTitle: userQuizzes.quizTitle,
          totalMark: userQuizzes.totalMark,
        })
        .from(userQuizzes)
        .leftJoin(users, eq(userQuizzes.userId, users.id))
        .groupBy(
          userQuizzes.userQuizId,
          userQuizzes.userId,
          userQuizzes.quizId,
          userQuizzes.score,
          userQuizzes.status,
        )
        .where(eq(userQuizzes.quizId, input.quizId));
    }),
  /**
   * Returns  all the data for single quiz
   * used to update exam
   * only for use in ADMIN side.
   */
  getQuizData: protectedProcedure
    .input(z.object({ quizId: z.string() }))
    .query(async ({ ctx, input }) => {
      const quizData = (await ctx.db.query.quizzes.findFirst({
        where: eq(quizzes.quizId, input.quizId),
      }))!;

      const questionsData = await ctx.db.query.questions.findMany({
        where: eq(questions.quizId, input.quizId),
        with: {
          options: {
            orderBy: [asc(options.optionOrder)],
          },
        },
        orderBy: [asc(questions.questionOrder)],
      });

      const usersInQuiz = await ctx.db.query.userQuizzes.findMany({
        where: eq(userQuizzes.quizId, input.quizId),
        columns: {
          userId: true,
        },
      });

      const usersId = usersInQuiz.map((user) => user.userId);

      return { ...quizData, usersId, questions: questionsData };
    }),
});

export default quizRouter;

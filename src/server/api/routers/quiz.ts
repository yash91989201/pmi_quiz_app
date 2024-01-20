import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { questions, quizzes, userQuizzes } from "@/server/db/schema";
import { eq, like, sql } from "drizzle-orm";
import z from "zod";

const quizRouter = createTRPCRouter({
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
            totalQuestions: sql<number>`COUNT(${questions.questionId}) AS totalQuestions`,
            totalUsers: sql<number>`COUNT(${userQuizzes.userQuizId}) AS usersAdded`,
            totalMark: quizzes.totalMark,
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
            totalQuestions: sql<number>`COUNT(${questions.questionId}) AS totalQuestions`,
            totalUsers: sql<number>`COUNT(${userQuizzes.userQuizId}) AS usersAdded`,
            totalMark: quizzes.totalMark,
          })
          .from(quizzes)
          .leftJoin(questions, eq(quizzes.quizId, questions.quizId))
          .leftJoin(userQuizzes, eq(quizzes.quizId, userQuizzes.quizId))
          .where(like(quizzes.quizTitle, `%${query?.toLowerCase()}%`))
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
});

export default quizRouter;

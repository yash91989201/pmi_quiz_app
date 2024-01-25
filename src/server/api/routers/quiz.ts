import z from "zod";
import { count, countDistinct, eq, like } from "drizzle-orm";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// SCHEMAS
import { questions, quizzes, userQuizzes } from "@/server/db/schema";

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
            totalQuestions: count(questions.questionId),
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

  getQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.quizzes.findMany({
      columns: {
        quizId: true,
        quizTitle: true,
      },
    });
  }),

  getUserQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({
        userQuizId: userQuizzes.userQuizId,
        userId: userQuizzes.userId,
        quizId: userQuizzes.quizId,
        score: userQuizzes.score,
        status: userQuizzes.status,
        quizTitle: quizzes.quizTitle,
        totalMark: quizzes.totalMark,
      })
      .from(userQuizzes)
      .leftJoin(quizzes, eq(userQuizzes.quizId, quizzes.quizId))
      .groupBy(
        userQuizzes.userQuizId,
        userQuizzes.userId,
        userQuizzes.quizId,
        userQuizzes.score,
        userQuizzes.status,
      )
      .where(eq(userQuizzes.userId, ctx.session.user.id));
  }),

  getUserQuizData: protectedProcedure
    .input(z.object({ userQuizId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userQuiz = (await ctx.db.query.userQuizzes.findFirst({
        where: eq(userQuizzes.userQuizId, input.userQuizId),
      }))!;

      const userQuestions = await ctx.db.query.questions.findMany({
        where: eq(questions.quizId, userQuiz.quizId),
        with: {
          options: {
            columns: {
              isCorrectOption: false,
            },
          },
        },
      });

      const questionsData = userQuestions.map((question) => {
        return {
          ...question,
          options: question.options.map((option) => ({
            ...option,
            isSelected: false,
          })),
        };
      });
      return {
        quizId: userQuiz.quizId,
        userQuizId: userQuiz.userQuizId,
        quizTitle: userQuiz.quizTitle,
        totalMark: userQuiz.totalMark,
        questions: questionsData,
      };
    }),
});

export default quizRouter;

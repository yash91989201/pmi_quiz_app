import z from "zod";
import { and, eq, like, sql } from "drizzle-orm";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// SCHEMAS
import { questions, quizzes, userQuizzes, users } from "@/server/db/schema";

const userRouter = createTRPCRouter({
  /**
   * Returns all the users data
   * to show data in table
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
      let usersQuery;
      const { query, page = 0, per_page = 0 } = input;

      if (query.length === 0) {
        usersQuery = ctx.db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            emailVerified: users.emailVerified,
            role: users.role,
            isTwoFactorEnabled: users.isTwoFactorEnabled,
            image: users.image,
            totalQuizzes: sql<number>`COUNT(${userQuizzes.userQuizId}) AS totalQuizzes`,
          })
          .from(users)
          .leftJoin(userQuizzes, eq(users.id, userQuizzes.userId))
          .groupBy(
            users.id,
            users.name,
            users.email,
            users.emailVerified,
            users.role,
            users.isTwoFactorEnabled,
            users.image,
          )
          .where(eq(users.role, "USER"))
          .prepare();
      } else {
        usersQuery = ctx.db.query.users
          .findMany({
            where: and(
              eq(users.role, "USER"),
              like(users.name, `%${query?.toLowerCase()}%`),
            ),
          })
          .prepare();
      }

      const fetchedUsers = await usersQuery.execute();

      // pagination logic
      if (page > 0 && per_page > 0) {
        const start = (page - 1) * per_page;
        const end = start + per_page;
        const paginatedUsersData =
          fetchedUsers.length < per_page
            ? fetchedUsers
            : fetchedUsers.slice(start, end);

        return {
          users: paginatedUsersData,
          hasPreviousPage: start > 0,
          hasNextPage: end < fetchedUsers.length,
          total_page: Math.ceil(fetchedUsers.length / per_page),
        };
      }

      return {
        users: fetchedUsers,
        hasPreviousPage: false,
        hasNextPage: false,
        total_page: 0,
      };
    }),
  /**
   * Returns all the id's of user with role=USER
   * used for adding users to quiz
   * used in ADMIN side
   */
  getAllUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({
      where: eq(users.role, "USER"),
    });
  }),

  /**
   * Returns all the quizzes for a specific user id
   * which is retrieved by using the session stored in ctx
   * only for use in USER side.
   */
  getQuizzes: protectedProcedure.query(({ ctx }) => {
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

  /**
   * Returns all the quiz data like questions and options
   * used for starting a quiz for a given user
   * only for use in USER side.
   */
  getQuizData: protectedProcedure
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

export default userRouter;

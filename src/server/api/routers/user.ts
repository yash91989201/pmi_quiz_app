import z from "zod";
import { and, eq, like, sql } from "drizzle-orm";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// SCHEMAS
import { userQuizzes, users } from "@/server/db/schema";

const userRouter = createTRPCRouter({
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
  // get users wil role USER
  getUsersId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({
      where: eq(users.role, "USER"),
      columns: {
        id: true,
        name: true,
      },
    });
  }),
});

export default userRouter;

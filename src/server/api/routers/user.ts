import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { and, eq, like } from "drizzle-orm";
import z from "zod";

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
        usersQuery = ctx.db.query.users
          .findMany({
            where: eq(users.role, "USER"),
          })
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
});

// const userRouter = createTRPCRouter({
//   getAll: protectedProcedure
//     .input(
//       z.object({
//         query: z.string().optional().default(""),
//         page: z.number().optional(),
//         per_page: z.number().optional(),
//       }),
//     )
//     .query(async ({ ctx, input }) => {
//       let customersQuery;
//       const { query, page = 0, per_page = 0 } = input;

//       if (query.length === 0) {
//         customersQuery = ctx.db
//           .select({
//             id: customers.id,
//             name: customers.name,
//             email: customers.email,
//             image: customers.image,
//             total_invoices: sql<number>`COUNT(${invoices.id}) AS total_invoices`,
//             total_pending: sql<number>`SUM(CASE WHEN ${invoices.status} = 'pending' THEN 1 ELSE 0 END) AS total_pending`,
//             total_paid: sql<number>`SUM(CASE WHEN ${invoices.status} = 'paid' THEN 1 ELSE 0 END) AS total_paid`,
//           })
//           .from(customers)
//           .leftJoin(invoices, eq(customers.id, invoices.customer_id))
//           .groupBy(
//             customers.id,
//             customers.name,
//             customers.email,
//             customers.image,
//           )
//           .prepare();
//       } else {
//         customersQuery = ctx.db
//           .select({
//             id: customers.id,
//             name: customers.name,
//             email: customers.email,
//             image: customers.image,
//             total_invoices: sql<number>`COUNT(${invoices.id}) AS total_invoices`,
//             total_pending: sql<number>`SUM(CASE WHEN ${invoices.status} = 'pending' THEN 1 ELSE 0 END) AS total_pending`,
//             total_paid: sql<number>`SUM(CASE WHEN ${invoices.status} = 'paid' THEN 1 ELSE 0 END) AS total_paid`,
//           })
//           .from(customers)
//           .leftJoin(invoices, eq(customers.id, invoices.customer_id))
//           .where(like(customers.name, `%${query?.toLowerCase()}%`))
//           .groupBy(
//             customers.id,
//             customers.name,
//             customers.email,
//             customers.image,
//           )
//           .prepare();
//       }

//       const fetchedCustomers = await customersQuery.execute();

//       // pagination logic
//       if (page > 0 && per_page > 0) {
//         const start = (page - 1) * per_page;
//         const end = start + per_page;
//         const paginatedCustomerData =
//           fetchedCustomers.length < per_page
//             ? fetchedCustomers
//             : fetchedCustomers.slice(start, end);

//         return {
//           customers: paginatedCustomerData,
//           hasPreviousPage: start > 0,
//           hasNextPage: end < fetchedCustomers.length,
//           total_page: Math.ceil(fetchedCustomers.length / per_page),
//         };
//       }

//       return {
//         customers: fetchedCustomers,
//         hasPreviousPage: false,
//         hasNextPage: false,
//         total_page: 0,
//       };
//     }),
// });

export default userRouter;

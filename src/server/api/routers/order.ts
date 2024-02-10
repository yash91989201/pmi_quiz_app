import { asc } from "drizzle-orm";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// SCHEMAS
import { orders } from "@/server/db/schema";

const orderRouter = createTRPCRouter({
  /**
   * Returns all the orders
   * only for use in ADMIN side.
   */
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.orders.findMany({
      orderBy: [asc(orders.orderPriority)],
    });
  }),
  getOrdersIdWithText: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.orders.findMany({
      columns: {
        orderId: true,
        orderText: true,
      },
      orderBy: [asc(orders.orderPriority)],
    });
  }),
});

export default orderRouter;

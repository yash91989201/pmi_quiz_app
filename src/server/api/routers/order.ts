// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { orders } from "@/server/db/schema";
import { asc } from "drizzle-orm";

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

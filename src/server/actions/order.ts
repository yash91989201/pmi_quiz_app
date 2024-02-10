"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
// UTILS
import { db } from "@/server/db";
// SCHEMAS
import { OrderFormSchema } from "@/lib/schema";
import { orders, userOrders, users } from "@/server/db/schema";
// TYPES
import type {
  UserOrderSchemaType,
  OrderFormSchemaType,
  OrderSchemaType,
} from "@/lib/schema";

export async function updateOrder(
  formData: OrderFormSchemaType,
): Promise<OrderFormStatusType> {
  const validatedFormData = OrderFormSchema.safeParse(formData);

  if (!validatedFormData.success) {
    return {
      status: "FAILED",
      message: "Cannot add orders.",
    };
  }

  const { orders: updatedOrders } = validatedFormData.data;
  const existingOrders = await db.query.orders.findMany();
  const existingUsers = await db.query.users.findMany({
    where: eq(users.role, "USER"),
  });

  const newOrders: OrderSchemaType[] = [];
  const updatedOrdersId: string[] = [];
  const deletedOrdersId: string[] = [];
  const newUsersOrders: UserOrderSchemaType[] = [];

  existingOrders.forEach((existingOrder) => {
    const currentUpdatedOrder = updatedOrders.find(
      (updatedOrder) => updatedOrder.orderId === existingOrder.orderId,
    );

    if (currentUpdatedOrder === undefined) {
      deletedOrdersId.push(existingOrder.orderId);
      return;
    }

    if (
      currentUpdatedOrder.orderPriority !== existingOrder.orderPriority ||
      currentUpdatedOrder.orderText !== existingOrder.orderText
    ) {
      updatedOrdersId.push(existingOrder.orderId);
    }
  });

  updatedOrders.forEach((updatedOrder) => {
    const existingOrder = existingOrders.find(
      (existingOrder) => existingOrder.orderId === updatedOrder.orderId,
    );
    if (existingOrder === undefined) {
      newOrders.push(updatedOrder);
    }
  });

  if (newOrders.length > 0) {
    await db.insert(orders).values(newOrders);
  }

  if (existingUsers.length > 0 && newOrders.length > 0) {
    existingUsers.map((existingUser) => {
      const newUserOrder: UserOrderSchemaType[] = newOrders.map((newOrder) => ({
        ...newOrder,
        userId: existingUser.id,
        userOrderId: createId(),
        isCompleted: false,
      }));

      newUsersOrders.push(...newUserOrder);
    });
    await db.insert(userOrders).values(newUsersOrders);
  }

  if (updatedOrdersId.length > 0) {
    await Promise.all(
      updatedOrdersId.map(async (updatedOrderId) => {
        const { orderPriority, orderText } = updatedOrders.find(
          (updatedOrder) => updatedOrder.orderId === updatedOrderId,
        )!;
        const updatedOrderQuery = await db
          .update(orders)
          .set({ orderText, orderPriority })
          .where(eq(orders.orderId, updatedOrderId));

        return updatedOrderQuery[0];
      }),
    );
    await Promise.all(
      updatedOrdersId.map(async (updatedOrderId) => {
        const { orderPriority, orderText } = updatedOrders.find(
          (updatedOrder) => updatedOrder.orderId === updatedOrderId,
        )!;
        const updatedUsersOrderQuery = await db
          .update(userOrders)
          .set({ orderText, orderPriority })
          .where(eq(userOrders.orderId, updatedOrderId));

        return updatedUsersOrderQuery[0];
      }),
    );
  }

  if (deletedOrdersId.length > 0) {
    await Promise.all(
      deletedOrdersId.map(async (deletedOrderId) => {
        const deleteOrderQuery = await db
          .delete(orders)
          .where(eq(orders.orderId, deletedOrderId));

        return deleteOrderQuery[0];
      }),
    );
    await Promise.all(
      deletedOrdersId.map(async (deletedOrderId) => {
        const updatedUsersOrderQuery = await db
          .delete(userOrders)
          .where(eq(userOrders.orderId, deletedOrderId));

        return updatedUsersOrderQuery[0];
      }),
    );
  }

  revalidatePath("/admin/orders");

  return {
    status: "FAILED",
    message: "Cannot add orders.",
  };
}

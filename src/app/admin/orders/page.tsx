// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import CreateOrderForm from "@/components/admin/orders/create-order-form";

export default async function OrdersPage() {
  const orders = await api.order.getAll.query();

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">Update Orders</h2>
      <CreateOrderForm initialOrders={orders} />
    </div>
  );
}

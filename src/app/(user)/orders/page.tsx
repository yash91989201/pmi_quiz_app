// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import UserOrders from "@/components/shared/user-orders";

export default async function OrdersPage() {
  const userOrders = await api.user.getUserOrdersOnUser.query();

  return (
    <div className="flex flex-col gap-6">
      <h3 className="rounded-md bg-primary  p-3 text-base font-medium text-white md:text-3xl">
        Order Status
      </h3>
      <UserOrders userOrders={userOrders} />
    </div>
  );
}

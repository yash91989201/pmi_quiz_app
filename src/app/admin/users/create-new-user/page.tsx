// CUSTOM COMPONENTS
import CreateNewUserForm from "@/components/admin/user/create-user-form";
import { api } from "@/trpc/server";

export default async function CreateNewUserPage() {
  const orders = await api.order.getAll.query();
  const availableOrders = orders.map((order) => ({
    ...order,
    isCompleted: false,
  }));

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-base  md:text-3xl">Create New User</h2>
        <CreateNewUserForm availableOrders={availableOrders || []} />
      </div>
    </>
  );
}

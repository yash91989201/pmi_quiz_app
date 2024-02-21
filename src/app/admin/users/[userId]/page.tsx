// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import DataTable from "@/components/ui/data-table";
import UserOrders from "@/components/shared/user-orders";
import { userQuizzesTableColumns } from "@/config/data-table-column-defs";

export default async function Page({ params }: { params: { userId: string } }) {
  const data = await api.quiz.getUserQuizzes.query({ userId: params.userId });
  const userOrders = await api.user.getUserOrdersOnAdmin.query({
    userId: params.userId,
  });

  return (
    <>
      <h3 className="text-base  md:text-xl">User&apos;s Exams</h3>
      <DataTable columns={userQuizzesTableColumns} data={data} />
      <h3 className="text-base  md:text-xl">User&apos;s Order Status</h3>
      <UserOrders userOrders={userOrders} />
    </>
  );
}

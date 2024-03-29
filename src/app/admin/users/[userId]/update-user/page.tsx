// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import UpdateUserForm from "@/components/admin/user/update-user-form";

export default async function Page({ params }: { params: { userId: string } }) {
  const data = await api.user.getUserById.query({ userId: params.userId });
  const userQuizzes = await api.quiz.getUserQuizzes.query({
    userId: params.userId,
  });
  const user = data[0]!;
  const quizzesId = userQuizzes.map((userQuiz) => userQuiz.quizId);
  const userOrders = await api.user.getUserOrdersOnAdmin.query({
    userId: user.id,
  });

  return (
    <>
      <h3 className="text-base  md:text-xl">Update User</h3>
      <UpdateUserForm
        defaultValues={{
          id: user.id,
          name: user.name,
          email: user.email,
          password: "password",
          quizzesId,
          orders: userOrders,
        }}
      />
    </>
  );
}

import type { ReactNode } from "react";
// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import UserPageBreadcrumbs from "@/components/admin/user/user-page-breadcrumbs";

export default async function QuizLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { userId: string };
}) {
  const data = await api.user.getUserById.query({ userId: params.userId });
  const user = data[0]!;
  return (
    <section className="flex flex-col gap-6">
      <h3 className="text-base  md:text-3xl">{user.name}</h3>
      <UserPageBreadcrumbs id={user.id} name={user.name} />
      {children}
    </section>
  );
}

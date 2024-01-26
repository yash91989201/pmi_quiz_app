// UTILS
import { getUserById } from "@/server/utils/user";
// CUSTOM COMPONENTS

export default async function Page({ params }: { params: { userId: string } }) {
  const user = await getUserById(params.userId);
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">{user?.name}</h2>
    </section>
  );
}

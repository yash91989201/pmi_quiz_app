import { currentRole } from "@/server/utils/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const userRole = await currentRole();

  if (userRole === "ADMIN") redirect("/admin/users");
  if (userRole === "USER") redirect("/quizzes");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center "></main>
  );
}

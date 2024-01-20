import { auth } from "@/server/utils/auth";

export default async function AdminPage() {
  const session = await auth();

  return <>{JSON.stringify(session)}</>;
}

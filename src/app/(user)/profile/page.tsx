// UTILS
import { currentUser } from "@/server/utils/auth";

export default async function ProfilePage() {
  const user = await currentUser();
  return <p>Username: {user?.name}</p>;
}

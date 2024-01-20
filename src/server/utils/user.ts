import { db } from "@/server/db";
import { users } from "@/server/db/schema";
// import { auth } from "@/server/utils/auth";
import { eq } from "drizzle-orm";

async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
}

async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
}

async function getUserByUserName(userName: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.name, userName),
  });
  return user;
}

// async function currentUser() {
//   const session = await auth();
//   return session?.user;
// }

const adminCount = async () => {
  const adminList = await db.query.users.findMany({
    where: eq(users.role, "ADMIN"),
  });
  return adminList == undefined ? 0 : adminList.length;
};

export { adminCount, getUserByEmail, getUserById, getUserByUserName };

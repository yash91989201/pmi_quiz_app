import { eq } from "drizzle-orm";
// UTILS
import { db } from "@/server/db";
// SCHEMAS
import { users } from "@/server/db/schema";

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

const adminCount = async () => {
  const adminList = await db.query.users.findMany({
    where: eq(users.role, "ADMIN"),
  });
  return adminList == undefined ? 0 : adminList.length;
};

export { adminCount, getUserByEmail, getUserById, getUserByUserName };

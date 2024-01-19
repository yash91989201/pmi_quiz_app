import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const userQuery = db.query.users
  .findMany({
    where: eq(users.role, "USER"),
  })
  .prepare();

export { userQuery };

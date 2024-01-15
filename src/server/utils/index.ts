import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const user = {
  getById: async (id: string) => {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    return user;
  },
  getByEmail: async (email: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  },
};

export { user };

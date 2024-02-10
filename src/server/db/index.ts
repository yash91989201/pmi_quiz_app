import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
// UTILS
import { env } from "@/env";
// SCHEMAS
import * as schema from "./schema";

const poolConnection = mysql.createPool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
});

export const db = drizzle(poolConnection, {
  schema,
  mode: "default",
  logger: env.NODE_ENV === "development",
});

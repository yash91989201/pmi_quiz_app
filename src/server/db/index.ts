import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
// UTILS
import { env } from "@/env";
// SCHEMAS
import * as schema from "./schema";

const poolConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "pmi_quiz_db",
});

export const db = drizzle(poolConnection, {
  schema,
  mode: "default",
  logger: env.NODE_ENV === "development",
});

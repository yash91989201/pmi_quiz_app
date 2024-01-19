import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const poolConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "pmi_quiz_db",
});

export const db = drizzle(poolConnection, { schema, mode: "default" });

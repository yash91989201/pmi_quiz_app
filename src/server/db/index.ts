import { env } from "@/env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/server/db/schema";

const poolConnection = mysql.createPool(env.DATABASE_URL);

export const db = drizzle(poolConnection, { schema, mode: "default" });

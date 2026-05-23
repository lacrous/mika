import { getDb } from "../api/queries/connection";
import { sql } from "drizzle-orm";

const db = getDb();

async function dropTables() {
  await db.execute(sql`DROP TABLE IF EXISTS favorites`);
  await db.execute(sql`DROP TABLE IF EXISTS watch_history`);
  console.log("Tables dropped successfully");
}

dropTables().catch(console.error);

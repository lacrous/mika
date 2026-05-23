import mysql from "mysql2/promise";
import fs from "fs";

const env = fs.readFileSync(".env", "utf8");
const line = env.split("\n").find(l => l.startsWith("DATABASE_URL="));
const url = new URL(line.replace("DATABASE_URL=", "").trim());

const conn = await mysql.createConnection({
  host: url.hostname, port: url.port || 3306,
  user: url.username, password: url.password,
  database: url.pathname.replace("/", ""),
});

console.log("✅ Connected to remote MySQL!\n");
const [tables] = await conn.execute("SHOW TABLES");
console.log("📦 Tables:");
for (const t of tables) {
  const name = Object.values(t)[0];
  const [rows] = await conn.execute(`SELECT COUNT(*) as c FROM \`${name}\``);
  console.log(`   ${name}: ${rows[0].c} rows`);
}
await conn.end();

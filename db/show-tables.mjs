/**
 * Show all database tables and their structure
 * Run: node db/show-tables.mjs
 */
import mysql from "mysql2/promise";
import fs from "fs";

const env = fs.readFileSync(".env", "utf8");
const line = env.split("\n").find((l) => l.startsWith("DATABASE_URL="));
const url = new URL(line.replace("DATABASE_URL=", "").trim());

const conn = await mysql.createConnection({
  host: url.hostname,
  port: url.port || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.replace("/", ""),
});

console.log("\u2550".repeat(60));
console.log("  MIKA ANIME - DATABASE TABLES");
console.log("\u2550".repeat(60));
console.log(`  Host: ${url.hostname}`);
console.log(`  DB:   ${url.pathname.replace("/", "")}`);
console.log("\u2500".repeat(60) + "\n");

const [tables] = await conn.execute("SHOW TABLES");

if (tables.length === 0) {
  console.log("  No tables found.\n");
} else {
  for (const t of tables) {
    const name = Object.values(t)[0];
    const [cols] = await conn.execute(`SHOW COLUMNS FROM \`${name}\``);
    const [rows] = await conn.execute(
      `SELECT COUNT(*) as c FROM \`${name}\``
    );

    console.log(`\u250c${"\u2500".repeat(58)}\u2510`);
    console.log(
      `\u2502 ${String(name).padEnd(30)} ${String(rows[0].c + " rows").padStart(25)}\u2502`
    );
    console.log(`\u251c${"\u2500".repeat(58)}\u2524`);

    for (const c of cols) {
      const pk = c.Key === "PRI" ? " \u26a1 PK" : "";
      const uni = c.Key === "UNI" ? " \ud83d\udd11 UNIQUE" : "";
      const def = c.Default ? ` default:${c.Default}` : "";
      console.log(
        `\u2502  ${String(c.Field).padEnd(20)} ${String(c.Type).padEnd(20)}${pk}${uni}${def}`
      );
    }
    console.log(`\u2514${"\u2500".repeat(58)}\u2518\n`);
  }
}

await conn.end();

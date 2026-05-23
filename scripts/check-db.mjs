/**
 * Database connection checker
 * Run: node scripts/check-db.mjs
 */
import mysql from "mysql2/promise";

async function check() {
  // Read DATABASE_URL from .env
  const envText = await import("fs").then((fs) =>
    fs.readFileSync(".env", "utf8")
  );
  const dbUrlLine = envText
    .split("\n")
    .find((line) => line.startsWith("DATABASE_URL="));
  if (!dbUrlLine) {
    console.error("❌ DATABASE_URL not found in .env");
    process.exit(1);
  }
  const databaseUrl = dbUrlLine.replace("DATABASE_URL=", "").trim();

  const url = new URL(databaseUrl);
  console.log("🔌 Connecting to MySQL...");
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port || 3306}`);
  console.log(`   User: ${url.username}`);
  console.log(`   DB:   ${url.pathname.replace("/", "")}`);
  console.log("");

  try {
    const conn = await mysql.createConnection({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.replace("/", ""),
    });

    console.log("✅ Connected to MySQL!\n");

    const [tables] = await conn.execute("SHOW TABLES");
    console.log("📦 Tables:");
    tables.forEach((t, i) => {
      const name = Object.values(t)[0];
      console.log(`   ${i + 1}. ${name}`);
    });

    // Show row counts
    console.log("\n📊 Row counts:");
    for (const t of tables) {
      const name = Object.values(t)[0];
      const [rows] = await conn.execute(`SELECT COUNT(*) as c FROM \`${name}\``);
      console.log(`   ${name}: ${rows[0].c} rows`);
    }

    await conn.end();
    console.log("\n✅ All checks passed!");
  } catch (err) {
    console.error("\n❌ Connection failed:");
    console.error(`   ${err.message}`);
    process.exit(1);
  }
}

check();

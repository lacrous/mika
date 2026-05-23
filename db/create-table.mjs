/**
 * Universal table creator for Mika Anime
 * Usage: node db/create-table.mjs <table-name>
 * Example: node db/create-table.mjs comments
 */
import mysql from "mysql2/promise";
import fs from "fs";

const tableName = process.argv[2];

if (!tableName) {
  console.log("Usage: node db/create-table.mjs <table-name>");
  console.log("Example: node db/create-table.mjs comments");
  process.exit(1);
}

// Read .env
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

// Define table schemas
const schemas = {
  comments: `
    CREATE TABLE IF NOT EXISTS comments (
      id bigint unsigned AUTO_INCREMENT PRIMARY KEY,
      user_id int unsigned NOT NULL,
      anime_id varchar(64) NOT NULL,
      text varchar(1000) NOT NULL,
      likes int unsigned DEFAULT 0,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `,
  reviews: `
    CREATE TABLE IF NOT EXISTS reviews (
      id bigint unsigned AUTO_INCREMENT PRIMARY KEY,
      user_id int unsigned NOT NULL,
      anime_id varchar(64) NOT NULL,
      rating int unsigned NOT NULL,
      comment varchar(1000),
      created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `,
  ratings: `
    CREATE TABLE IF NOT EXISTS ratings (
      id bigint unsigned AUTO_INCREMENT PRIMARY KEY,
      user_id int unsigned NOT NULL,
      anime_id varchar(64) NOT NULL,
      score int unsigned NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
      UNIQUE KEY unique_user_anime_rating (user_id, anime_id)
    )
  `,
  local_users: `
    CREATE TABLE IF NOT EXISTS local_users (
      id int unsigned AUTO_INCREMENT PRIMARY KEY,
      email varchar(255) NOT NULL UNIQUE,
      password_hash varchar(255) NOT NULL,
      name varchar(128) NOT NULL,
      avatar varchar(1024),
      role varchar(16) DEFAULT 'user' NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      last_sign_in_at timestamp NULL
    )
  `,
  notifications: `
    CREATE TABLE IF NOT EXISTS notifications (
      id bigint unsigned AUTO_INCREMENT PRIMARY KEY,
      user_id int unsigned NOT NULL,
      title varchar(255) NOT NULL,
      message varchar(500) NOT NULL,
      is_read tinyint(1) DEFAULT 0,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `,
};

const sql = schemas[tableName];

if (!sql) {
  console.log(`\u274c Unknown table: "${tableName}"`);
  console.log("\ud83d\udccb Available tables:");
  Object.keys(schemas).forEach((k) => console.log(`   - ${k}`));
  console.log("\n\u270d\ufe0f  To add a new schema, edit db/create-table.mjs");
  await conn.end();
  process.exit(1);
}

// Check if table already exists
const [existing] = await conn.execute(
  "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?",
  [tableName]
);

if (existing.length > 0) {
  console.log(`\u26a0\ufe0f  Table "${tableName}" already exists!`);
  const [cols] = await conn.execute(`SHOW COLUMNS FROM \`${tableName}\``);
  console.log(`\n   Columns (${cols.length}):`);
  cols.forEach((c) => console.log(`     - ${c.Field} (${c.Type})`));
} else {
  await conn.execute(sql);
  console.log(`\u2705 Table "${tableName}" created successfully!`);

  // Show structure
  const [cols] = await conn.execute(`SHOW COLUMNS FROM \`${tableName}\``);
  console.log(`\n   Columns (${cols.length}):`);
  cols.forEach((c) => {
    const pk = c.Key === "PRI" ? " [PK]" : "";
    console.log(`     - ${c.Field} (${c.Type})${pk}`);
  });
}

await conn.end();

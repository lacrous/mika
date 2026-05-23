import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL || "mysql://root@localhost:3306/mika_anime";

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);

  // Create local_users table (for email/password auth)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS local_users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(128) NOT NULL,
      avatar VARCHAR(1024),
      role VARCHAR(16) DEFAULT 'user' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
      last_sign_in_at TIMESTAMP NULL
    )
  `);

  // Create reviews table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      user_type VARCHAR(16) NOT NULL DEFAULT 'local',
      user_name VARCHAR(128) NOT NULL,
      user_avatar VARCHAR(1024),
      anime_id VARCHAR(64) NOT NULL,
      anime_title VARCHAR(255) NOT NULL,
      rating INT UNSIGNED NOT NULL,
      content VARCHAR(2000) NOT NULL,
      is_approved VARCHAR(16) NOT NULL DEFAULT 'approved',
      helpful_count INT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);

  // Create site_settings table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(128) NOT NULL UNIQUE,
      setting_value JSON,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);

  console.log("Tables created successfully!");
  await conn.end();
}

main().catch(console.error);

#!/bin/bash
# MySQL Setup Script for Mika Anime

echo "=== Installing MySQL Server ==="
sudo apt update
sudo apt install mysql-server -y

echo "=== Starting MySQL ==="
sudo systemctl start mysql
sudo systemctl enable mysql

echo "=== Creating database and tables ==="
sudo mysql -e "CREATE DATABASE IF NOT EXISTS mika_anime CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

sudo mysql mika_anime << 'EOF'
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
);

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  union_id VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(255),
  name VARCHAR(128),
  avatar VARCHAR(1024),
  role VARCHAR(16) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  last_signIn_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS favorites (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  user_type VARCHAR(16) NOT NULL DEFAULT 'local',
  anime_id VARCHAR(64) NOT NULL,
  anime_title VARCHAR(255) NOT NULL,
  anime_image VARCHAR(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS watch_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  user_type VARCHAR(16) NOT NULL DEFAULT 'local',
  anime_id VARCHAR(64) NOT NULL,
  anime_title VARCHAR(255) NOT NULL,
  episode INT UNSIGNED NOT NULL DEFAULT 1,
  progress INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

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
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(128) NOT NULL UNIQUE,
  setting_value JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);
EOF

echo "=== Setting root password ==="
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

echo "=== MySQL Status ==="
sudo systemctl status mysql --no-pager

echo "=== Done! Tables created: ==="
sudo mysql mika_anime -e "SHOW TABLES;"

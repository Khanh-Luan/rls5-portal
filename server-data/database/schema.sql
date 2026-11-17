-- Schema mẫu cho MariaDB / MySQL khi kết nối dữ liệu bền vững (ví dụ qua oxmysql)

CREATE DATABASE IF NOT EXISTS fivem_rp_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fivem_rp_dev;

CREATE TABLE IF NOT EXISTS players (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(80) NOT NULL UNIQUE COMMENT 'license:... từ Cfx.re',
  name VARCHAR(80) NOT NULL,
  cash BIGINT NOT NULL DEFAULT 2500,
  bank BIGINT NOT NULL DEFAULT 15000,
  job VARCHAR(40) NOT NULL DEFAULT 'unemployed',
  job_grade TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sender_identifier VARCHAR(80) NULL,
  receiver_identifier VARCHAR(80) NOT NULL,
  account_type ENUM('cash', 'bank') NOT NULL DEFAULT 'bank',
  tx_type ENUM('transfer', 'salary', 'admin_grant', 'purchase') NOT NULL,
  amount BIGINT NOT NULL,
  note VARCHAR(160) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_receiver (receiver_identifier),
  INDEX idx_sender (sender_identifier)
);

DROP DATABASE IF EXISTS codebook;
CREATE DATABASE codebook;

USE codebook;

CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  user_hash VARCHAR(255),
  profile_id INT UNIQUE,
  passport_type ENUM('google', 'github', 'local') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pages(
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id INT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE cells(
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_id INT,
  cell_type ENUM('code', 'text'),
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(page_id) REFERENCES pages(id)
);

CREATE TABLE tabs(
  id INT AUTO_INCREMENT PRIMARY KEY,
  cell_id INT,
  code_language ENUM('javascript', 'html', 'css' ) NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(cell_id) REFERENCES cells(id)
);

INSERT INTO users (email) 
VALUES  ('riley@gmail.com'),
        ('parker@gmail.com'),
        ('ryder@gmail.com'),
        ('hunter@gmail.com'),
        ('harley@gmail.com');

INSERT INTO pages ()
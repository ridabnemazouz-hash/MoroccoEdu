const mysql = require('mysql2/promise');
require('dotenv').config();

const init = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    console.log('🏗️  Creating database if not exists...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    console.log('🏗️  Creating table "schools"...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        short_name VARCHAR(50),
        code VARCHAR(50) UNIQUE,
        city VARCHAR(100),
        type VARCHAR(50),
        is_public BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Database and table initialized successfully!');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  } finally {
    await connection.end();
  }
};

init();

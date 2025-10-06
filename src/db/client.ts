import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import 'dotenv/config';

// Create MySQL pool using separate env variables
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
});

// Test connection
pool.getConnection()
  .then((conn) => {
    console.log(`✅ Connected to MySQL database '${process.env.DB_NAME}' at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
    conn.release(); // release connection back to pool
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // exit app if DB connection fails
  });

// Initialize Drizzle ORM
export const db = drizzle(pool);

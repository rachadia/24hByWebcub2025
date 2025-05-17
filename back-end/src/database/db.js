import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "192.168.1.168",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "LesM4ki!",
  database: process.env.DB_NAME || "lesmakiscodeu_the_end_page_db",
};

// Create a pool of connections
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    return false;
  }
};

// Execute SQL query
const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw error;
  }
};

export { pool, query, testConnection };
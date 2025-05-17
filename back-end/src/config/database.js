import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || "lesmakiscodeu_the_end_page_db",
  process.env.DB_USER || "Makiscodeur",
  process.env.DB_PASSWORD || "LesM4ki!",
  {
    host: process.env.DB_HOST || "192.168.161.12:3306", 
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the Sequelize instance and connection test function
export { sequelize, testConnection };
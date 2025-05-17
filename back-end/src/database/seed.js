import bcrypt from 'bcryptjs';
import { query } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample users for seeding
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminPassword123',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin'
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'userPassword123',
    first_name: 'Regular',
    last_name: 'User',
    role: 'user'
  }
];

// Seed the database with sample data
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Hash passwords and insert users
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Check if user already exists
      const existingUser = await query(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [user.email, user.username]
      );
      
      if (existingUser.length === 0) {
        await query(
          'INSERT INTO users (username, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)',
          [user.username, user.email, hashedPassword, user.first_name, user.last_name, user.role]
        );
        console.log(`User ${user.username} created successfully.`);
      } else {
        console.log(`User ${user.username} already exists. Skipping...`);
      }
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

// Execute seeding
seedDatabase().then(() => {
  console.log('Seeding process complete');
  process.exit(0);
});
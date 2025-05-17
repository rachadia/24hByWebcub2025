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

// Sample events for seeding
const events = [
  {
    title: 'Premier événement de test',
    content: 'Ceci est le contenu du premier événement de test. Il contient des informations importantes.',
    theme: 'Technologie',
    emotion: 'Excité',
    likes: 5
  },
  {
    title: 'Réunion d\'équipe',
    content: 'Réunion hebdomadaire pour discuter des progrès du projet.',
    theme: 'Travail',
    emotion: 'Concentré',
    likes: 3
  },
  {
    title: 'Soirée de lancement',
    content: 'Grande soirée pour célébrer le lancement de notre nouveau produit.',
    theme: 'Célébration',
    emotion: 'Heureux',
    likes: 10
  }
];

// Sample comments for seeding
const comments = [
  {
    content: 'Super événement !',
    event_index: 0
  },
  {
    content: 'Je suis d\'accord avec toi !',
    event_index: 0
  },
  {
    content: 'À ne pas manquer !',
    event_index: 2
  }
];

// Sample attachments for seeding
const attachments = [
  {
    attachment_url: 'https://example.com/images/event1.jpg',
    event_index: 0
  },
  {
    attachment_url: 'https://example.com/documents/meeting_notes.pdf',
    event_index: 1
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

    // Get user IDs for event creation
    const adminRows = await query('SELECT id FROM users WHERE username = ?', ['admin']);
    if (!adminRows || adminRows.length === 0) {
      console.error('Admin user not found! adminRows:', adminRows);
      process.exit(1);
    }
    const adminUser = adminRows[0];
    const regularRows = await query('SELECT id FROM users WHERE username = ?', ['user']);
    if (!regularRows || regularRows.length === 0) {
      console.error('Regular user not found! regularRows:', regularRows);
      process.exit(1);
    }
    const regularUser = regularRows[0];

    // Insert events
    for (const event of events) {
      const existingRows = await query(
        'SELECT * FROM events WHERE title = ?',
        [event.title]
      );
      const existingEvent = existingRows && existingRows[0];

      if (!existingEvent) {
        const result = await query(
          'INSERT INTO events (user_id, title, content, theme, emotion, likes) VALUES (?, ?, ?, ?, ?, ?)',
          [adminUser.id, event.title, event.content, event.theme, event.emotion, event.likes || 0]
        );
        console.log(`Event "${event.title}" created successfully.`);

        // Add comments for this event
        const eventComments = comments.filter(comment => comment.event_index === events.indexOf(event));
        for (const comment of eventComments) {
          await query(
            'INSERT INTO event_comments (event_id, user_id, content) VALUES (?, ?, ?)',
            [result.insertId, regularUser.id, comment.content]
          );
        }

        // Add attachments for this event
        const eventAttachments = attachments.filter(attachment => attachment.event_index === events.indexOf(event));
        for (const attachment of eventAttachments) {
          await query(
            'INSERT INTO event_attachments (event_id, attachment_url) VALUES (?, ?)',
            [result.insertId, attachment.attachment_url]
          );
        }
      } else {
        console.log(`Event "${event.title}" already exists. Skipping...`);
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
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import userRoutes from './routes/users.js';
import apiRoutes from './routes/api.js';

// Import database connection
import { sequelize } from './config/database.js';
import './models/associations.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(limiter);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Global variables middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/users', userRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'The End Page - Share Your Life\'s Moments',
    user: req.session.user
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Page Not Found',
    user: req.session.user
  });
});

// Database connection and server start
sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default app;
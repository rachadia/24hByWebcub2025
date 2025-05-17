import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Register validation rules
const registerValidationRules = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

// Login validation rules
const loginValidationRules = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register route
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('auth/register', { 
    title: 'Register - The End Page',
    errors: [],
    formData: {}
  });
});

router.post('/register', isNotAuthenticated, registerValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Register - The End Page',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    const { username, email, password } = req.body;

    // Check if user with email or username already exists
    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.render('auth/register', {
        title: 'Register - The End Page',
        errors: [{ msg: 'User with that email or username already exists' }],
        formData: req.body
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      isVerified: true // For simplicity in the MVP, we're auto-verifying users
    });

    req.flash('success_msg', 'You are now registered and can log in');
    return res.redirect('/auth/login');
  } catch (err) {
    console.error('Error registering user:', err);
    req.flash('error_msg', 'An error occurred during registration');
    return res.redirect('/auth/register');
  }
});

// Login route
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('auth/login', { 
    title: 'Login - The End Page',
    errors: []
  });
});

router.post('/login', isNotAuthenticated, loginValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Login - The End Page',
      errors: errors.array()
    });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res.render('auth/login', {
        title: 'Login - The End Page',
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    // Validate password
    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Login - The End Page',
        errors: [{ msg: 'Invalid email or password' }]
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Create session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    // Create JWT token for API access
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    req.session.token = token;
    
    req.flash('success_msg', 'You are now logged in');
    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Error logging in:', err);
    req.flash('error_msg', 'An error occurred during login');
    return res.redirect('/auth/login');
  }
});

// Logout route
router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/auth/login');
  });
});

export default router;
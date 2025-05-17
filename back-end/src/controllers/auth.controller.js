import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/user.model.js';

dotenv.config();

class AuthController {
  // Register a new user
  async register(req, res, next) {
    try {
      const { username, email, password, first_name, last_name } = req.body;
      
      // Check if user already exists
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      
      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ message: 'Username already taken' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user
      const userId = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        first_name,
        last_name,
        role: 'user' // Default role
      });
      
      // Create JWT token
      const token = jwt.sign(
        { userId, username, email, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      
      // Get user data (without password)
      const user = await UserModel.findById(userId);
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const { userId } = req.user;
      
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
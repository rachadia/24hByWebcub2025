import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model.js';

class UserController {
  // Get all users (admin only)
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await UserModel.findAll(page, limit);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  
  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
  
  // Update user
  async updateUser(req, res, next) {
    try {
      const { userId, role } = req.user;
      const { id } = req.params;
      
      // Check if user is updating their own profile or if they're an admin
      if (userId !== parseInt(id) && role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
      }
      
      const { username, email, password, first_name, last_name } = req.body;
      const updateData = { username, email, first_name, last_name };
      
      // If username or email is changing, check for duplicates
      if (username) {
        const existingUser = await UserModel.findByUsername(username);
        if (existingUser && existingUser.id !== parseInt(id)) {
          return res.status(409).json({ message: 'Username already taken' });
        }
      }
      
      if (email) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser && existingUser.id !== parseInt(id)) {
          return res.status(409).json({ message: 'Email already in use' });
        }
      }
      
      // Hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      // Update user
      const updated = await UserModel.update(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: 'User not found or no changes applied' });
      }
      
      // Get updated user
      const user = await UserModel.findById(id);
      
      res.status(200).json({
        message: 'User updated successfully',
        user
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Delete user
  async deleteUser(req, res, next) {
    try {
      const { userId, role } = req.user;
      const { id } = req.params;
      
      // Check if user is deleting their own account or if they're an admin
      if (userId !== parseInt(id) && role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
      }
      
      const deleted = await UserModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
import { query } from '../database/db.js';

class UserModel {
  // Create a new user
  async create(userData) {
    const { username, email, password, first_name, last_name, role } = userData;
    
    const sql = `
      INSERT INTO users 
      (username, email, password, first_name, last_name, role) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      username, 
      email, 
      password, 
      first_name || null, 
      last_name || null, 
      role || 'user'
    ]);
    
    return result.insertId;
  }
  
  // Find user by ID
  async findById(id) {
    const sql = 'SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users[0] || null;
  }
  
  // Find user by email
  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0] || null;
  }
  
  // Find user by username
  async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const users = await query(sql, [username]);
    return users[0] || null;
  }
  
  // Update user
  async update(id, userData) {
    const updateFields = [];
    const queryParams = [];
    
    // Build dynamic update query
    for (const [key, value] of Object.entries(userData)) {
      if (key !== 'id' && key !== 'password') { // Skip id and handle password separately
        updateFields.push(`${key} = ?`);
        queryParams.push(value);
      }
    }
    
    // If password is being updated, it should already be hashed by controller
    if (userData.password) {
      updateFields.push('password = ?');
      queryParams.push(userData.password);
    }
    
    if (updateFields.length === 0) {
      return false; // Nothing to update
    }
    
    // Add id as the last parameter
    queryParams.push(id);
    
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await query(sql, queryParams);
    
    return result.affectedRows > 0;
  }
  
  // Delete user
  async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
  
  // List all users (with pagination)
  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT id, username, email, first_name, last_name, role, created_at 
      FROM users 
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const users = await query(sql, [limit, offset]);
    
    // Get total count for pagination
    const countResult = await query('SELECT COUNT(*) as count FROM users');
    const totalCount = countResult[0].count;
    
    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: offset + users.length < totalCount
      }
    };
  }
}

export default new UserModel();
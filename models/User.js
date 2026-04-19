const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create({ name, email, password, roleId = 1 }) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, roleId]
    );
    
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const users = await query(
      'SELECT u.id, u.name, u.email, u.password_hash, u.role_id, u.created_at, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      [email]
    );
    
    return users.length > 0 ? users[0] : null;
  }

  // Find user by ID
  static async findById(id) {
    const users = await query(
      'SELECT u.id, u.name, u.email, u.role_id, u.created_at, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [id]
    );
    
    return users.length > 0 ? users[0] : null;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users (admin only)
  static async getAll({ limit = 20, offset = 0 }) {
    const users = await query(
      'SELECT u.id, u.name, u.email, u.role_id, u.created_at, r.name as role FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    const countRes = await query('SELECT COUNT(*) as total FROM users');
    
    return {
      data: users,
      total: countRes[0].total,
      limit,
      offset
    };
  }

  // Update user
  static async update(id, updates) {
    const allowedFields = ['name', 'email', 'role_id'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return false;

    values.push(id);
    await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return true;
  }

  // Delete user
  static async delete(id) {
    await query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
}

module.exports = User;

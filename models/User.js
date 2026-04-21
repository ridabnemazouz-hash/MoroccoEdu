const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create new user (regular or social)
  static async create({ name, email, password, google_id = null, facebook_id = null, roleId = 1 }) {
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }
    
    const result = await query(
      'INSERT INTO users (name, email, password_hash, google_id, facebook_id, role_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, passwordHash, google_id, facebook_id, roleId]
    );
    
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const users = await query(
      'SELECT u.id, u.name, u.email, u.password_hash, u.google_id, u.facebook_id, u.role_id, u.created_at, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      [email]
    );
    
    return users.length > 0 ? users[0] : null;
  }

  // Find user by Google ID
  static async findByGoogleId(googleId) {
    const users = await query(
      'SELECT u.id, u.name, u.email, u.role_id, u.created_at, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.google_id = ?',
      [googleId]
    );
    return users.length > 0 ? users[0] : null;
  }

  // Find user by Facebook ID
  static async findByFacebookId(facebookId) {
    const users = await query(
      'SELECT u.id, u.name, u.email, u.role_id, u.created_at, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.facebook_id = ?',
      [facebookId]
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
    const allowedFields = ['name', 'email', 'role_id', 'google_id', 'facebook_id'];
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

  // Save refresh token
  static async saveRefreshToken(userId, token) {
    const hash = bcrypt.hashSync(token, 10);
    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [userId, hash]
    );
  }

  // Verify refresh token
  static async verifyRefreshToken(userId, token) {
    const tokens = await query(
      'SELECT token_hash FROM refresh_tokens WHERE user_id = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    
    if (tokens.length === 0) return false;
    
    return bcrypt.compareSync(token, tokens[0].token_hash);
  }

  // Remove refresh token
  static async removeRefreshToken(userId, token) {
    const hash = bcrypt.hashSync(token, 10);
    await query('DELETE FROM refresh_tokens WHERE user_id = ? AND token_hash = ?', [userId, hash]);
  }

  // Remove all refresh tokens for a user (logout from all devices)
  static async removeAllRefreshTokens(userId) {
    await query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }
}

module.exports = User;

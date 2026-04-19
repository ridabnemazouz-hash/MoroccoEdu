const { query } = require('../config/db');

class School {
  static async getAll({ limit = 20, offset = 0 }) {
    const data = await query(
      'SELECT * FROM schools ORDER BY id ASC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const countRes = await query('SELECT COUNT(*) as total FROM schools');
    return {
      data,
      total: countRes[0].total,
      limit,
      offset
    };
  }

  static async search(searchTerm, { limit = 20, offset = 0 }) {
    const q = `%${searchTerm}%`;
    const sql = `
      SELECT * FROM schools 
      WHERE name LIKE ? 
         OR short_name LIKE ? 
         OR code LIKE ? 
         OR city LIKE ? 
      ORDER BY id ASC
      LIMIT ? OFFSET ?
    `;
    const data = await query(sql, [q, q, q, q, limit, offset]);

    const countSql = `
      SELECT COUNT(*) as total FROM schools 
      WHERE name LIKE ? 
         OR short_name LIKE ? 
         OR code LIKE ? 
         OR city LIKE ?
    `;
    const countRes = await query(countSql, [q, q, q, q]);

    return {
      data,
      total: countRes[0].total,
      searchTerm,
      limit,
      offset
    };
  }
}

module.exports = School;

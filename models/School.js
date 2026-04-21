const { query } = require('../config/db');

class School {
  static async getAll({ limit = 20, offset = 0 }) {
    const data = await query(
      `SELECT s.id, s.name, s.short_name, s.code, s.city, s.type, s.is_public, 
              COALESCE(AVG(r.rating), 0) as avg_rating, 
              COUNT(r.id) as review_count 
       FROM schools s 
       LEFT JOIN school_reviews r ON s.id = r.school_id 
       GROUP BY s.id, s.name, s.short_name, s.code, s.city, s.type, s.is_public 
       ORDER BY s.id ASC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const countRes = await query('SELECT COUNT(*) as total FROM schools');
    return {
      data: data.map(item => ({
        ...item,
        avg_rating: parseFloat(item.avg_rating).toFixed(1)
      })),
      total: countRes[0].total,
      limit,
      offset
    };
  }

  static async search(searchTerm, { limit = 20, offset = 0 }) {
    const q = `%${searchTerm}%`;
    const sql = `
      SELECT s.id, s.name, s.short_name, s.code, s.city, s.type, s.is_public, 
             COALESCE(AVG(r.rating), 0) as avg_rating, 
             COUNT(r.id) as review_count 
      FROM schools s 
      LEFT JOIN school_reviews r ON s.id = r.school_id 
      WHERE s.name LIKE ? 
         OR s.short_name LIKE ? 
         OR s.code LIKE ? 
         OR s.city LIKE ? 
      GROUP BY s.id, s.name, s.short_name, s.code, s.city, s.type, s.is_public 
      ORDER BY s.id ASC
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
      data: data.map(item => ({
        ...item,
        avg_rating: parseFloat(item.avg_rating).toFixed(1)
      })),
      total: countRes[0].total,
      searchTerm,
      limit,
      offset
    };
  }
}

module.exports = School;

const { query } = require('../config/db');

class Review {
  // Create a new review
  static async create({ schoolId, userId, rating, comment }) {
    const result = await query(
      'INSERT INTO school_reviews (school_id, user_id, rating, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)',
      [schoolId, userId, rating, comment]
    );
    return result.insertId;
  }

  // Get reviews for a school
  static async getBySchoolId(schoolId, { limit = 10, offset = 0 } = {}) {
    const reviews = await query(
      `SELECT r.*, u.name as user_name 
       FROM school_reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.school_id = ? 
       ORDER BY r.created_at DESC 
       LIMIT ? OFFSET ?`,
      [schoolId, limit, offset]
    );
    return reviews;
  }

  // Get average rating for a school
  static async getAverageRating(schoolId) {
    const result = await query(
      'SELECT AVG(rating) as average, COUNT(*) as count FROM school_reviews WHERE school_id = ?',
      [schoolId]
    );
    return {
        average: parseFloat(result[0].average || 0).toFixed(1),
        count: result[0].count
    };
  }

  // Delete a review
  static async delete(id, userId) {
    await query('DELETE FROM school_reviews WHERE id = ? AND user_id = ?', [id, userId]);
    return true;
  }
}

module.exports = Review;

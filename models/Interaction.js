const { query } = require('../config/db');

class Interaction {
  // Add comment
  static async addComment({ resourceId, userId, content, parentId = null }) {
    const result = await query(
      'INSERT INTO comments (resource_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [resourceId, userId, content, parentId]
    );
    return result.insertId;
  }

  // Get comments for a resource
  static async getComments(resourceId) {
    const comments = await query(
      `SELECT c.*, u.name as user_name, u.email as user_email
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.resource_id = ?
       ORDER BY c.created_at ASC`,
      [resourceId]
    );

    // Organize into nested structure
    const commentMap = new Map();
    const rootComments = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  // Delete comment
  static async deleteComment(commentId, userId) {
    const result = await query('DELETE FROM comments WHERE id = ? AND user_id = ?', [commentId, userId]);
    return result.affectedRows > 0;
  }

  // Add or update reaction
  static async addReaction({ resourceId, userId, type }) {
    // Check if reaction already exists
    const existing = await query(
      'SELECT id, type FROM reactions WHERE resource_id = ? AND user_id = ?',
      [resourceId, userId]
    );

    if (existing.length > 0) {
      // Update existing reaction
      await query(
        'UPDATE reactions SET type = ? WHERE resource_id = ? AND user_id = ?',
        [type, resourceId, userId]
      );
      return 'updated';
    } else {
      // Create new reaction
      await query(
        'INSERT INTO reactions (resource_id, user_id, type) VALUES (?, ?, ?)',
        [resourceId, userId, type]
      );
      return 'created';
    }
  }

  // Remove reaction
  static async removeReaction(resourceId, userId) {
    await query('DELETE FROM reactions WHERE resource_id = ? AND user_id = ?', [resourceId, userId]);
    return true;
  }

  // Get reactions count for a resource
  static async getReactionCounts(resourceId) {
    const counts = await query(
      `SELECT 
        SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) as likes,
        SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) as dislikes
       FROM reactions WHERE resource_id = ?`,
      [resourceId]
    );

    return {
      likes: parseInt(counts[0].likes) || 0,
      dislikes: parseInt(counts[0].dislikes) || 0
    };
  }

  // Get user's reaction for a resource
  static async getUserReaction(resourceId, userId) {
    const reactions = await query(
      'SELECT type FROM reactions WHERE resource_id = ? AND user_id = ?',
      [resourceId, userId]
    );
    
    return reactions.length > 0 ? reactions[0].type : null;
  }

  // Track view
  static async trackView({ resourceId, userId = null }) {
    await query(
      'INSERT INTO views (resource_id, user_id) VALUES (?, ?)',
      [resourceId, userId]
    );
  }

  // Get view count for a resource
  static async getViewCount(resourceId) {
    const result = await query(
      'SELECT COUNT(*) as count FROM views WHERE resource_id = ?',
      [resourceId]
    );
    
    return result[0].count;
  }
}

module.exports = Interaction;

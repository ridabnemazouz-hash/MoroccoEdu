const { query } = require('../config/db');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

class Resource {
  // Create resource
  static async create({ moduleId, userId, type, title, description, fileUrl }) {
    const result = await query(
      'INSERT INTO resources (module_id, user_id, type, title, description, file_url) VALUES (?, ?, ?, ?, ?, ?)',
      [moduleId, userId, type, title, description, fileUrl]
    );
    return result.insertId;
  }

  // Get all resources for a module
  static async getResourcesByModule(moduleId, { limit = 50, offset = 0 }) {
    const resources = await query(
      `SELECT r.*, u.name as author_name, u.email as author_email,
              COALESCE(like_count.likes, 0) as likes,
              COALESCE(dislike_count.dislikes, 0) as dislikes,
              COALESCE(comment_count.comments, 0) as comment_count
       FROM resources r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as likes 
         FROM reactions 
         WHERE type = 'like' 
         GROUP BY resource_id
       ) like_count ON r.id = like_count.resource_id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as dislikes 
         FROM reactions 
         WHERE type = 'dislike' 
         GROUP BY resource_id
       ) dislike_count ON r.id = dislike_count.resource_id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as comments 
         FROM comments 
         GROUP BY resource_id
       ) comment_count ON r.id = comment_count.resource_id
       WHERE r.module_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [moduleId, limit, offset]
    );
    
    const countRes = await query('SELECT COUNT(*) as total FROM resources WHERE module_id = ?', [moduleId]);
    
    return {
      data: resources,
      total: countRes[0].total,
      limit,
      offset
    };
  }

  // Get trending resources (globally sorted by views + likes)
  static async getTrendingResources({ limit = 20, offset = 0 } = {}) {
    const resources = await query(
      `SELECT r.*, u.name as author_name, m.name as module_name, s.name as school_name,
              COALESCE(like_count.likes, 0) as likes,
              COALESCE(dislike_count.dislikes, 0) as dislikes,
              COALESCE(comment_count.comments, 0) as comment_count
       FROM resources r
       JOIN users u ON r.user_id = u.id
       JOIN modules m ON r.module_id = m.id
       JOIN semesters sem ON m.semester_id = sem.id
       JOIN fields f ON sem.field_id = f.id
       JOIN schools s ON f.school_id = s.id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as likes 
         FROM reactions 
         WHERE type = 'like' 
         GROUP BY resource_id
       ) like_count ON r.id = like_count.resource_id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as dislikes 
         FROM reactions 
         WHERE type = 'dislike' 
         GROUP BY resource_id
       ) dislike_count ON r.id = dislike_count.resource_id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as comments 
         FROM comments 
         GROUP BY resource_id
       ) comment_count ON r.id = comment_count.resource_id
       ORDER BY (r.views + COALESCE(like_count.likes, 0) * 2) DESC, r.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const countRes = await query('SELECT COUNT(*) as total FROM resources');
    
    return {
      data: resources,
      total: countRes[0].total,
      limit,
      offset
    };
  }

  // Get resource by ID
  static async getResourceById(id) {
    const resources = await query(
      `SELECT r.*, u.name as author_name, u.email as author_email,
              COALESCE(like_count.likes, 0) as likes,
              COALESCE(dislike_count.dislikes, 0) as dislikes,
              COALESCE(comment_count.comments, 0) as comment_count
       FROM resources r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as likes 
         FROM reactions 
         WHERE type = 'like' 
         GROUP BY resource_id
       ) like_count ON r.id = like_count.resource_id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as dislikes 
         FROM reactions 
         WHERE type = 'dislike' 
         GROUP BY resource_id
       ) dislike_count ON r.id = dislike_count.resource_id
       LEFT JOIN (
         SELECT resource_id, COUNT(*) as comments 
         FROM comments 
         GROUP BY resource_id
       ) comment_count ON r.id = comment_count.resource_id
       WHERE r.id = ?`,
      [id]
    );
    
    return resources.length > 0 ? resources[0] : null;
  }

  // Update resource
  static async update(id, updates, userId) {
    const allowedFields = ['title', 'description', 'file_url'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return false;

    values.push(id, userId);
    await query(
      `UPDATE resources SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    return true;
  }

  // Delete resource
  static async delete(id, userId) {
    // Get resource to extract public_id if it's a cloudinary URL
    const resources = await query('SELECT file_url FROM resources WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (resources.length === 0) return false;

    // Extract public_id from Cloudinary URL and delete from cloud
    const fileUrl = resources[0].file_url;
    if (fileUrl && fileUrl.includes('cloudinary.com')) {
      try {
        const publicId = this.extractPublicId(fileUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }

    await query('DELETE FROM resources WHERE id = ? AND user_id = ?', [id, userId]);
    return true;
  }

  // Increment view count
  static async incrementViews(id) {
    await query('UPDATE resources SET views = views + 1 WHERE id = ?', [id]);
  }

  // Extract public_id from Cloudinary URL
  static extractPublicId(url) {
    try {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return null;
      
      const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithExtension.split('.')[0];
      return publicId;
    } catch (error) {
      return null;
    }
  }
}

module.exports = Resource;

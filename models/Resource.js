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
              (SELECT COUNT(*) FROM reactions WHERE resource_id = r.id AND type = 'like') as likes,
              (SELECT COUNT(*) FROM reactions WHERE resource_id = r.id AND type = 'dislike') as dislikes,
              (SELECT COUNT(*) FROM comments WHERE resource_id = r.id) as comment_count
       FROM resources r
       JOIN users u ON r.user_id = u.id
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

  // Get resource by ID
  static async getResourceById(id) {
    const resources = await query(
      `SELECT r.*, u.name as author_name, u.email as author_email,
              (SELECT COUNT(*) FROM reactions WHERE resource_id = r.id AND type = 'like') as likes,
              (SELECT COUNT(*) FROM reactions WHERE resource_id = r.id AND type = 'dislike') as dislikes,
              (SELECT COUNT(*) FROM comments WHERE resource_id = r.id) as comment_count
       FROM resources r
       JOIN users u ON r.user_id = u.id
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

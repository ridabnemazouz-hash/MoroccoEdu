const Resource = require('../models/Resource');
const { query } = require('../config/db');

// @desc    Get professor dashboard analytics
// @route   GET /api/professor/dashboard
// @access  Private (Professor)
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get stats
    const stats = await query(`
      SELECT 
        COUNT(id) as total_uploads,
        SUM(views) as total_views
      FROM resources 
      WHERE user_id = ?
    `, [userId]);

    const reactions = await query(`
      SELECT COUNT(re.id) as total_likes
      FROM reactions re
      JOIN resources res ON re.resource_id = res.id
      WHERE res.user_id = ? AND re.type = 'like'
    `, [userId]);

    // Get recent activity
    const recentResources = await query(`
      SELECT r.*, m.name as module_name
      FROM resources r
      JOIN modules m ON r.module_id = m.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [userId]);

    res.json({
      success: true,
      data: {
        stats: {
          total_uploads: stats[0].total_uploads || 0,
          total_views: stats[0].total_views || 0,
          total_likes: reactions[0].total_likes || 0
        },
        recentResources
      }
    });
  } catch (error) {
    console.error('Professor dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

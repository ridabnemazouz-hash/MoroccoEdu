const Resource = require('../models/Resource');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Upload a resource to a module
// @route   POST /api/modules/:moduleId/resources
// @access  Private (Professor+)
exports.uploadResource = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { type, title, description } = req.body;

    // Validation
    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resource type and title'
      });
    }

    const validTypes = ['pdf', 'video', 'image', 'note'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type. Must be: pdf, video, image, or note'
      });
    }

    let fileUrl = null;

    // Upload file to Cloudinary if present
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, `resources/${type}`);
      fileUrl = result.secure_url;
    }

    // Create resource in database
    const resourceId = await Resource.create({
      moduleId,
      userId: req.user.id,
      type,
      title,
      description: description || '',
      fileUrl
    });

    const resource = await Resource.getResourceById(resourceId);

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: resource
    });
  } catch (error) {
    console.error('Upload resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
};

// @desc    Get all resources for a module
// @route   GET /api/modules/:moduleId/resources
// @access  Public
exports.getResourcesByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await Resource.getResourcesByModule(moduleId, { limit, offset });

    res.json({
      success: true,
      data: result.data,
      total: result.total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trending resources globally
// @route   GET /api/resources/trending
// @access  Public
exports.getTrendingResources = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await Resource.getTrendingResources({ limit, offset });

    res.json({
      success: true,
      data: result.data,
      total: result.total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Get trending resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single resource details
// @route   GET /api/resources/:resourceId
// @access  Public
exports.getResourceDetail = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.getResourceById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Increment view count
    await Resource.incrementViews(resourceId);

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Get resource detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:resourceId
// @access  Private (Owner or Admin)
exports.deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const deleted = await Resource.delete(resourceId, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found or you do not have permission'
      });
    }

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

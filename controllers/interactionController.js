const Interaction = require('../models/Interaction');

// @desc    Add comment to a resource
// @route   POST /api/resources/:resourceId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { content, parentId } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const commentId = await Interaction.addComment({
      resourceId,
      userId: req.user.id,
      content: content.trim(),
      parentId: parentId || null
    });

    // Get the created comment
    const comments = await Interaction.getComments(resourceId);
    const newComment = comments.find(c => c.id === commentId);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all comments for a resource
// @route   GET /api/resources/:resourceId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const comments = await Interaction.getComments(resourceId);

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add or update reaction on a resource
// @route   POST /api/resources/:resourceId/reactions
// @access  Private
exports.addReaction = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { type } = req.body;

    if (!type || (type !== 'like' && type !== 'dislike')) {
      return res.status(400).json({
        success: false,
        message: 'Reaction type must be "like" or "dislike"'
      });
    }

    const action = await Interaction.addReaction({
      resourceId,
      userId: req.user.id,
      type
    });

    // Get updated counts
    const counts = await Interaction.getReactionCounts(resourceId);

    res.json({
      success: true,
      message: `Reaction ${action === 'created' ? 'added' : 'updated'} successfully`,
      data: {
        action,
        ...counts,
        userReaction: type
      }
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove reaction from a resource
// @route   DELETE /api/resources/:resourceId/reactions
// @access  Private
exports.removeReaction = async (req, res) => {
  try {
    const { resourceId } = req.params;
    await Interaction.removeReaction(resourceId, req.user.id);

    const counts = await Interaction.getReactionCounts(resourceId);

    res.json({
      success: true,
      message: 'Reaction removed successfully',
      data: counts
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Track a view for a resource
// @route   POST /api/resources/:resourceId/views
// @access  Public
exports.trackView = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user ? req.user.id : null;

    await Interaction.trackView({ resourceId, userId });

    const viewCount = await Interaction.getViewCount(resourceId);

    res.json({
      success: true,
      data: { views: viewCount }
    });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const Review = require('../models/Review');

// @desc    Add or update a review for a school
// @route   POST /api/reviews/:schoolId
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5'
      });
    }

    await Review.create({ schoolId, userId, rating, comment });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during review submission'
    });
  }
};

// @desc    Get reviews for a school
// @route   GET /api/reviews/:schoolId
// @access  Public
exports.getSchoolReviews = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await Review.getBySchoolId(schoolId, { 
      limit: parseInt(limit), 
      offset: parseInt(offset) 
    });
    const avgRating = await Review.getAverageRating(schoolId);

    res.json({
      success: true,
      data: {
        reviews,
        stats: avgRating
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Review.delete(id, userId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

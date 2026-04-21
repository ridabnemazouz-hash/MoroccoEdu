const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/:schoolId')
  .get(reviewController.getSchoolReviews)
  .post(protect, reviewController.addReview);

router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;

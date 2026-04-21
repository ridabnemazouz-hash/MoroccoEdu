const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  addCommentSchema,
  getCommentsSchema,
  addReactionSchema,
  trackViewSchema
} = require('../middleware/validators/interactionValidator');

// Get comments (public)
router.get('/resources/:resourceId/comments', validate(getCommentsSchema), interactionController.getComments);

// Track view (public)
router.post('/resources/:resourceId/views', validate(trackViewSchema), interactionController.trackView);

// Add comment (protected)
router.post('/resources/:resourceId/comments', protect, validate(addCommentSchema), interactionController.addComment);

// Add reaction (protected)
router.post('/resources/:resourceId/reactions', protect, validate(addReactionSchema), interactionController.addReaction);

// Remove reaction (protected)
router.delete('/resources/:resourceId/reactions', protect, interactionController.removeReaction);

module.exports = router;

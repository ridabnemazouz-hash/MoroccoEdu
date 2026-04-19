const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { protect } = require('../middleware/auth');

// Get comments (public)
router.get('/resources/:resourceId/comments', interactionController.getComments);

// Track view (public)
router.post('/resources/:resourceId/views', interactionController.trackView);

// Add comment (protected)
router.post('/resources/:resourceId/comments', protect, interactionController.addComment);

// Add reaction (protected)
router.post('/resources/:resourceId/reactions', protect, interactionController.addReaction);

// Remove reaction (protected)
router.delete('/resources/:resourceId/reactions', protect, interactionController.removeReaction);

module.exports = router;

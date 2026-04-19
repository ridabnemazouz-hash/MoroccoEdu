const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');
const { singleFile } = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Upload resource (professor or admin only)
router.post('/modules/:moduleId/resources', authorize('professor', 'admin'), singleFile, resourceController.uploadResource);

// Get resources for a module (public access - move before protected routes)
router.get('/modules/:moduleId/resources', resourceController.getResourcesByModule);

// Get single resource
router.get('/resources/:resourceId', resourceController.getResourceDetail);

// Delete resource (owner or admin)
router.delete('/resources/:resourceId', resourceController.deleteResource);

module.exports = router;

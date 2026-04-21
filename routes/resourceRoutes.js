const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');
const { singleFile } = require('../middleware/upload');
const validate = require('../middleware/validate');
const {
  uploadResourceSchema,
  getResourceSchema,
  getResourcesSchema
} = require('../middleware/validators/resourceValidator');

// Get resources for a module (public)
router.get('/modules/:moduleId/resources', validate(getResourcesSchema), resourceController.getResourcesByModule);

// Get trending resources (public)
router.get('/resources/trending', resourceController.getTrendingResources);

// Get single resource (public)
router.get('/resources/:resourceId', validate(getResourceSchema), resourceController.getResourceDetail);

// Protected routes below
router.post('/modules/:moduleId/resources', protect, authorize('professor', 'admin'), validate(uploadResourceSchema), singleFile, resourceController.uploadResource);
router.delete('/resources/:resourceId', protect, resourceController.deleteResource);

module.exports = router;

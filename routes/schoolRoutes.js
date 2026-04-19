const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.get('/', schoolController.getSchools);
router.get('/search', schoolController.searchSchools);

module.exports = router;

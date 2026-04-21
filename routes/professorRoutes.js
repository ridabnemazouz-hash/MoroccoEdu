const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('professor', 'admin'), professorController.getDashboardData);

module.exports = router;

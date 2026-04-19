const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

router.get('/schools/:schoolId/fields', academicController.getFieldsBySchool);
router.get('/fields/:fieldId/semesters', academicController.getSemestersByField);
router.get('/semesters/:semesterId/modules', academicController.getModulesBySemester);
router.get('/modules/:moduleId', academicController.getModuleDetail);

module.exports = router;

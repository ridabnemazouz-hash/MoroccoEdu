const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/auth');

router.route('/schools/:schoolId/fields')
  .get(academicController.getFieldsBySchool)
  .post(protect, authorize('admin'), academicController.addField);

router.get('/fields/:fieldId/semesters', academicController.getSemestersByField);
router.get('/semesters/:semesterId/modules', academicController.getModulesBySemester);
router.get('/modules/:moduleId', academicController.getModuleDetail);

module.exports = router;

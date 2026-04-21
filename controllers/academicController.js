const Academic = require('../models/Academic');

// @desc    Get all fields for a school
// @route   GET /api/schools/:schoolId/fields
// @access  Public
exports.getFieldsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const result = await Academic.getFieldsBySchool(schoolId);
    
    res.json({
      success: true,
      data: result.data,
      total: result.total
    });
  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add a field to a school (Admin only)
// @route   POST /api/schools/:schoolId/fields
// @access  Private/Admin
exports.addField = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Field name is required' });
    }

    // Call the model function which will handle validation and insertion
    const fieldId = await Academic.createFieldWithValidation({ schoolId, name, description });
    
    if (fieldId === -1) {
       return res.status(404).json({ success: false, message: 'School not found' });
    } else if (fieldId === -2) {
       return res.status(400).json({ success: false, message: 'Invalid field mapping for this school type' });
    } else if (fieldId === -3) {
       return res.status(400).json({ success: false, message: 'Field already exists in this school' });
    }

    res.status(201).json({
      success: true,
      data: { id: fieldId, school_id: schoolId, name, description }
    });
  } catch (error) {
    console.error('Add field error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
       return res.status(400).json({ success: false, message: 'Field already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all semesters for a field
// @route   GET /api/fields/:fieldId/semesters
// @access  Public
exports.getSemestersByField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const result = await Academic.getSemestersByField(fieldId);
    
    res.json({
      success: true,
      data: result.data,
      total: result.total
    });
  } catch (error) {
    console.error('Get semesters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all modules for a semester
// @route   GET /api/semesters/:semesterId/modules
// @access  Public
exports.getModulesBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const result = await Academic.getModulesBySemester(semesterId);
    
    res.json({
      success: true,
      data: result.data,
      total: result.total
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get module details
// @route   GET /api/modules/:moduleId
// @access  Public
exports.getModuleDetail = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Academic.getModuleById(moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Get module detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

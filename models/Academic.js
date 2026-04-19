const { query } = require('../config/db');

class Academic {
  // Get all fields for a school
  static async getFieldsBySchool(schoolId) {
    const fields = await query(
      'SELECT * FROM fields WHERE school_id = ? ORDER BY created_at ASC',
      [schoolId]
    );
    
    const countRes = await query('SELECT COUNT(*) as total FROM fields WHERE school_id = ?', [schoolId]);
    
    return {
      data: fields,
      total: countRes[0].total
    };
  }

  // Get field by ID
  static async getFieldById(id) {
    const fields = await query('SELECT * FROM fields WHERE id = ?', [id]);
    return fields.length > 0 ? fields[0] : null;
  }

  // Create field
  static async createField({ schoolId, name, description }) {
    const result = await query(
      'INSERT INTO fields (school_id, name, description) VALUES (?, ?, ?)',
      [schoolId, name, description]
    );
    return result.insertId;
  }

  // Get all semesters for a field
  static async getSemestersByField(fieldId) {
    const semesters = await query(
      'SELECT * FROM semesters WHERE field_id = ? ORDER BY semester_number ASC',
      [fieldId]
    );
    
    const countRes = await query('SELECT COUNT(*) as total FROM semesters WHERE field_id = ?', [fieldId]);
    
    return {
      data: semesters,
      total: countRes[0].total
    };
  }

  // Get semester by ID
  static async getSemesterById(id) {
    const semesters = await query('SELECT * FROM semesters WHERE id = ?', [id]);
    return semesters.length > 0 ? semesters[0] : null;
  }

  // Create semester
  static async createSemester({ fieldId, name, semesterNumber }) {
    const result = await query(
      'INSERT INTO semesters (field_id, name, semester_number) VALUES (?, ?, ?)',
      [fieldId, name, semesterNumber]
    );
    return result.insertId;
  }

  // Get all modules for a semester
  static async getModulesBySemester(semesterId) {
    const modules = await query(
      'SELECT * FROM modules WHERE semester_id = ? ORDER BY created_at ASC',
      [semesterId]
    );
    
    const countRes = await query('SELECT COUNT(*) as total FROM modules WHERE semester_id = ?', [semesterId]);
    
    return {
      data: modules,
      total: countRes[0].total
    };
  }

  // Get module by ID with detailed info
  static async getModuleById(id) {
    const modules = await query(
      `SELECT m.*, s.name as semester_name, s.semester_number, f.name as field_name, f.id as field_id, sch.name as school_name
       FROM modules m
       JOIN semesters s ON m.semester_id = s.id
       JOIN fields f ON s.field_id = f.id
       JOIN schools sch ON f.school_id = sch.id
       WHERE m.id = ?`,
      [id]
    );
    
    return modules.length > 0 ? modules[0] : null;
  }

  // Create module
  static async createModule({ semesterId, name, code, description }) {
    const result = await query(
      'INSERT INTO modules (semester_id, name, code, description) VALUES (?, ?, ?, ?)',
      [semesterId, name, code, description]
    );
    return result.insertId;
  }
}

module.exports = Academic;

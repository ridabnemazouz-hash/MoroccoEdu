const fs = require('fs');
const path = require('path');
const { query, pool } = require('../config/db');

const seedData = async () => {
  try {
    const dataPath = path.join(__dirname, '../data/schools_data.json');
    const schools = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`🚀 Starting seeding ${schools.length} schools into MySQL...`);

    // In MySQL, we use '?' as placeholder, but for bulk it's better to use values array
    for (const school of schools) {
      const sql = `
        INSERT INTO schools (name, short_name, code, city, type, is_public)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=name
      `;
      const values = [
        school.name,
        school.short_name,
        school.code,
        school.city,
        school.type,
        school.is_public
      ];
      await query(sql, values);
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();

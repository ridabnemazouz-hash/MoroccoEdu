const { query } = require('../config/db');

async function migrate() {
  try {
    console.log('🌍 Starting hierarchy migration...');

    // 1. Create countries table
    await query(`
      CREATE TABLE IF NOT EXISTS countries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(10) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Create cities table
    await query(`
      CREATE TABLE IF NOT EXISTS cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        country_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
        UNIQUE KEY unique_city_country (name, country_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Update schools table
    console.log('🔄 Updating schools table structure...');
    const columns = await query("SHOW COLUMNS FROM schools LIKE 'city_id'");
    if (columns.length === 0) {
      await query('ALTER TABLE schools ADD COLUMN city_id INT AFTER code');
      await query('ALTER TABLE schools ADD CONSTRAINT fk_schools_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL');
    }

    // 4. Seed Data
    console.log('🌱 Seeding initial hierarchy data...');
    
    // Add Morocco
    await query('INSERT IGNORE INTO countries (name, code) VALUES (?, ?)', ['Morocco', 'MA']);
    const moroccoRes = await query('SELECT id FROM countries WHERE name = ?', ['Morocco']);
    const maId = moroccoRes[0].id;

    // Add Cities
    const cities = ['Casablanca', 'Rabat', 'El Jadida', 'Fes', 'Marrakech', 'Oujda', 'Tangier', 'Agadir'];
    for (const city of cities) {
      await query('INSERT IGNORE INTO cities (country_id, name) VALUES (?, ?)', [maId, city]);
    }

    // Link existing schools to cities if they match
    console.log('🔗 Linking existing schools to new cities...');
    const schools = await query('SELECT id, city FROM schools WHERE city_id IS NULL');
    for (const school of schools) {
      if (school.city) {
        const cityMatch = await query('SELECT id FROM cities WHERE name = ? AND country_id = ?', [school.city, maId]);
        if (cityMatch.length > 0) {
          await query('UPDATE schools SET city_id = ? WHERE id = ?', [cityMatch[0].id, school.id]);
        }
      }
    }

    console.log('✅ Hierarchy migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();

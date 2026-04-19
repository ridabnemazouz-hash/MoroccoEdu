const { query, pool } = require('../config/db');

const seedAcademicData = async () => {
  try {
    console.log('🚀 Starting academic data seeding...');

    // Seed roles
    console.log('\n📋 Seeding roles...');
    const roles = ['student', 'professor', 'admin'];
    for (const role of roles) {
      await query('INSERT IGNORE INTO roles (name) VALUES (?)', [role]);
    }
    console.log('✅ Roles seeded');

    // Get all schools
    const schools = await query('SELECT id, name, city FROM schools');
    console.log(`\n📚 Seeding academic data for ${schools.length} schools...`);

    // Common fields of study
    const fieldsTemplate = [
      { name: 'Computer Science', description: 'Study of computation, automation, and information' },
      { name: 'Mathematics', description: 'Study of numbers, quantity, and space' },
      { name: 'Physics', description: 'Study of matter, energy, and the fundamental forces of nature' },
      { name: 'Economics', description: 'Study of production, distribution, and consumption of goods' },
      { name: 'Law', description: 'Study of legal systems and jurisprudence' }
    ];

    // Common modules for each field
    const modulesTemplate = {
      'Computer Science': {
        1: [
          { name: 'Introduction to Programming', code: 'CS101', description: 'Basics of programming with Python' },
          { name: 'Discrete Mathematics', code: 'CS102', description: 'Mathematical structures for computer science' },
          { name: 'Computer Architecture', code: 'CS103', description: 'Fundamentals of computer systems' }
        ],
        2: [
          { name: 'Data Structures', code: 'CS201', description: 'Organization and management of data' },
          { name: 'Algorithms', code: 'CS202', description: 'Design and analysis of algorithms' },
          { name: 'Database Systems', code: 'CS203', description: 'Relational database design and SQL' }
        ]
      },
      'Mathematics': {
        1: [
          { name: 'Calculus I', code: 'MATH101', description: 'Limits, derivatives, and integrals' },
          { name: 'Linear Algebra', code: 'MATH102', description: 'Vector spaces and matrices' },
          { name: 'Mathematical Logic', code: 'MATH103', description: 'Foundations of mathematical reasoning' }
        ],
        2: [
          { name: 'Calculus II', code: 'MATH201', description: 'Advanced integration techniques' },
          { name: 'Probability Theory', code: 'MATH202', description: 'Introduction to probability' },
          { name: 'Number Theory', code: 'MATH203', description: 'Properties of integers' }
        ]
      },
      'Physics': {
        1: [
          { name: 'Classical Mechanics', code: 'PHY101', description: 'Newtonian mechanics and motion' },
          { name: 'Electromagnetism', code: 'PHY102', description: 'Electric and magnetic fields' },
          { name: 'Thermodynamics', code: 'PHY103', description: 'Heat and energy transfer' }
        ],
        2: [
          { name: 'Quantum Physics', code: 'PHY201', description: 'Introduction to quantum mechanics' },
          { name: 'Optics', code: 'PHY202', description: 'Study of light and vision' },
          { name: 'Modern Physics', code: 'PHY203', description: 'Contemporary physics topics' }
        ]
      },
      'Economics': {
        1: [
          { name: 'Microeconomics', code: 'ECON101', description: 'Individual and firm behavior' },
          { name: 'Macroeconomics', code: 'ECON102', description: 'Economy-wide phenomena' },
          { name: 'Statistics for Economics', code: 'ECON103', description: 'Statistical methods in economics' }
        ],
        2: [
          { name: 'Econometrics', code: 'ECON201', description: 'Statistical methods for economic data' },
          { name: 'International Trade', code: 'ECON202', description: 'Global trade theories' },
          { name: 'Development Economics', code: 'ECON203', description: 'Economic development theories' }
        ]
      },
      'Law': {
        1: [
          { name: 'Constitutional Law', code: 'LAW101', description: 'Fundamental legal principles' },
          { name: 'Civil Law', code: 'LAW102', description: 'Private legal matters' },
          { name: 'Legal Research', code: 'LAW103', description: 'Methods of legal investigation' }
        ],
        2: [
          { name: 'Criminal Law', code: 'LAW201', description: 'Crimes and punishment' },
          { name: 'Commercial Law', code: 'LAW202', description: 'Business legal frameworks' },
          { name: 'International Law', code: 'LAW203', description: 'Global legal systems' }
        ]
      }
    };

    let schoolCount = 0;
    for (const school of schools) {
      schoolCount++;
      console.log(`\n[${schoolCount}/${schools.length}] Processing: ${school.name}`);

      // Add 2-3 fields per school (random selection)
      const numFields = Math.floor(Math.random() * 2) + 2; // 2 or 3
      const selectedFields = fieldsTemplate
        .sort(() => 0.5 - Math.random())
        .slice(0, numFields);

      for (const fieldData of selectedFields) {
        // Create field
        const fieldId = await query(
          'INSERT INTO fields (school_id, name, description) VALUES (?, ?, ?)',
          [school.id, fieldData.name, fieldData.description]
        );
        console.log(`  ✓ Field: ${fieldData.name}`);

        // Create 2 semesters
        for (let sem = 1; sem <= 2; sem++) {
          const semesterId = await query(
            'INSERT INTO semesters (field_id, name, semester_number) VALUES (?, ?, ?)',
            [fieldId.insertId, `Semester ${sem}`, sem]
          );

          // Add modules for this semester
          const modules = modulesTemplate[fieldData.name]?.[sem] || [];
          for (const moduleData of modules) {
            await query(
              'INSERT INTO modules (semester_id, name, code, description) VALUES (?, ?, ?, ?)',
              [semesterId.insertId, moduleData.name, moduleData.code, moduleData.description]
            );
          }
          console.log(`    ✓ Semester ${sem}: ${modules.length} modules`);
        }
      }

      if (schoolCount % 10 === 0) {
        console.log(`\n... Progress: ${schoolCount}/${schools.length} schools processed`);
      }
    }

    console.log('\n✅ Academic data seeding completed successfully!');
    console.log(`📊 Total schools processed: ${schoolCount}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Academic seeding failed:', err);
    process.exit(1);
  }
};

seedAcademicData();

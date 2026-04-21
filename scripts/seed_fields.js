const { query } = require('../config/db');

// --- ACADEMIC MAPPING DICTIONARY ---
const ACADEMIC_MAPPING = {
  'ENSA': [
    { name: 'Génie Informatique', desc: 'Ingénierie des systèmes d\'information et développement logiciel.' },
    { name: 'Génie Industriel et Logistique', desc: 'Amélioration de la productivité et gestion de la chaîne d\'approvisionnement.' },
    { name: 'Génie Électrique et Systèmes Embarqués', desc: 'Électronique, automatique et systèmes temps réel.' },
    { name: 'Génie Réseaux et Télécommunications', desc: 'Infrastructures réseau, sécurité et télécoms.' },
  ],
  'EST': [
    { name: 'Techniques de Management', desc: 'Gestion d\'entreprise, comptabilité et GRH.' },
    { name: 'Génie Informatique / Logiciel', desc: 'Développement d\'applications et bases de données.' },
    { name: 'Techniques de Commercialisation', desc: 'Marketing, ventes et relation client.' },
    { name: 'Génie Électrique et Énergies Renouvelables', desc: 'Installations électriques et énergies de demain.' }
  ],
  'FSJES': [
    { name: 'Sciences Économiques et Gestion', desc: 'Axe fondamental de l\'économie et management.' },
    { name: 'Droit Privé (Français)', desc: 'Juridiction civile et droit des affaires en langue française.' },
    { name: 'Droit Public (Français)', desc: 'Droit administratif, constitutionnel et international.' },
    { name: 'Droit (Arabe)', desc: 'Études juridiques et administratives en langue arabe.' }
  ],
  'FST': [
    { name: 'MIP (Mathématiques, Informatique, Physique)', desc: 'Tronc commun scientifique axé sur l\'informatique et sciences dures.' },
    { name: 'BCG (Biologie, Chimie, Géologie)', desc: 'Tronc commun axé sur les sciences de la vie et de la terre.' },
    { name: 'Génie Électrique et Informatique Industrielle', desc: 'Systèmes industriels automatisés.' }
  ],
  'ESEF': [
    { name: 'Licence en Éducation - Enseignement Primaire', desc: 'Préparation au métier d\'enseignant du primaire.' },
    { name: 'Licence en Éducation - Spécialité Informatique', desc: 'Pédagogie et enseignement de l\'informatique.' },
    { name: 'Licence en Éducation - Langue Anglaise', desc: 'Enseignement de l\'anglais et didactique.' },
    { name: 'Licence en Éducation - Langue Française', desc: 'Enseignement du français et didactique.' }
  ],
  'ENCG': [
    { name: 'Gestion Financière et Comptable (GFC)', desc: 'Finance d\'entreprise, audit et analyse de marché.' },
    { name: 'Marketing et Action Commerciale (MAC)', desc: 'Stratégie marketing et gestion des marques.' },
    { name: 'Audit et Contrôle de Gestion (ACG)', desc: 'Contrôle des performances et audit interne.' }
  ],
  'FMP': [
    { name: 'Médecine Générale', desc: 'Études fondamentales de médecine et pratique clinique.' },
    { name: 'Pharmacie', desc: 'Sciences pharmaceutiques, biologie et conception de médicaments.' }
  ],
  'FLSH': [
    { name: 'Études Françaises', desc: 'Littérature, linguistique et civilisation française.' },
    { name: 'Études Anglaises', desc: 'Littérature anglophone, traduction et « cultural studies ».' },
    { name: 'Études Arabes', desc: 'Linguistique et littérature arabes classiques et modernes.' }
  ],
  'DEFAULT': [
    { name: 'Sciences et Technologies', desc: 'Cursus général en sciences appliquées et fondamentales.' },
    { name: 'Gestion et Commerce', desc: 'Business et management des organisations.' },
    { name: 'Sciences Humaines', desc: 'Développement sociétal et psychologie.' }
  ]
};

// --- HELPER FUNCTION: Determine school type based on name/short_name ---
function determineSchoolType(school) {
  const identifier = (school.short_name + ' ' + school.name).toUpperCase();
  if (identifier.includes('ENSA')) return 'ENSA';
  if (identifier.includes('EST') || identifier.includes('TECHNOLOGY')) return 'EST';
  if (identifier.includes('FSJES') || identifier.includes('ECONOM') || identifier.includes('LAW')) return 'FSJES';
  if (identifier.includes('FST') || identifier.includes('SCIENCE AND TECHNOLOGY')) return 'FST';
  if (identifier.includes('ESEF') || identifier.includes('EDUCATION')) return 'ESEF';
  if (identifier.includes('ENCG') || identifier.includes('BUSINESS')) return 'ENCG';
  if (identifier.includes('FMP') || identifier.includes('MEDICINE') || identifier.includes('HEALTH')) return 'FMP';
  if (identifier.includes('FLSH') || identifier.includes('HUMANITIES') || identifier.includes('LITERATURE')) return 'FLSH';
  
  return 'DEFAULT';
}

async function prepareDatabase() {
  console.log('🔄 Cleaning old generic academic data (Fields, Semesters, Modules)...');
  
  // Disable FK checks to safely truncate
  await query('SET FOREIGN_KEY_CHECKS = 0');
  
  // Wipe all existing academic data safely
  await query('TRUNCATE TABLE modules');
  await query('TRUNCATE TABLE semesters');
  await query('TRUNCATE TABLE fields');
  
  // Attempt to add UNIQUE constraint on school_id + name
  try {
    await query('ALTER TABLE fields ADD CONSTRAINT unique_school_field UNIQUE (school_id, name)');
    console.log('✅ Added unique constraint on fields (school_id, name).');
  } catch (err) {
    // Expected to fail if constraint already exists or syntax variation, so we ignore it safely
    if (!err.message.includes('Duplicate key')) {
      // console.log('⚠️ Unique constraint might already exist:', err.message);
    }
  }

  await query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('🗑️ Clean completed. Database ready for smart seeding.');
}

async function generateSemestersAndModules(fieldId, fieldName) {
  // Let's add Semester 1 and Semester 2 for every field
  for (let s = 1; s <= 2; s++) {
    const semInsert = await query(
      'INSERT INTO semesters (field_id, name, semester_number) VALUES (?, ?, ?)',
      [fieldId, `Semester ${s}`, s]
    );
    const semesterId = semInsert.insertId;

    // Add 2 realistic modules per semester based loosely on the field
    let modules = [
      { name: `Introduction to ${fieldName.split(' ')[0]}`, code: `${fieldName.substring(0,3).toUpperCase()}10${s}` },
      { name: `Core Methodologies and Practices S${s}`, code: `MET10${s}` }
    ];

    if (fieldName.includes('Informatique')) {
      modules = s === 1 ? [
        { name: 'Algorithmique et Programmation C', code: 'ALG101' },
        { name: 'Architecture des Ordinateurs', code: 'ARC102' }
      ] : [
        { name: 'Bases de Données (SQL)', code: 'BDD201' },
        { name: 'Programmation Orientée Objet (Java)', code: 'POO202' }
      ];
    } else if (fieldName.includes('Économie') || fieldName.includes('Management')) {
      modules = s === 1 ? [
        { name: 'Microéconomie', code: 'ECO101' },
        { name: 'Comptabilité Générale', code: 'CGO102' }
      ] : [
        { name: 'Macroéconomie', code: 'ECO201' },
        { name: 'Management Général', code: 'MGT202' }
      ];
    } else if (fieldName.includes('Éducation')) {
       modules = s === 1 ? [
        { name: 'Introduction à la Pédagogie', code: 'PED101' },
        { name: 'Psychologie de l\'Enfant', code: 'PSY102' }
      ] : [
        { name: 'Didactique Générale', code: 'DID201' },
        { name: 'Technologies Éducatives', code: 'TCE202' }
      ];
    }

    for (const mod of modules) {
      await query(
        'INSERT INTO modules (semester_id, name, code, description) VALUES (?, ?, ?, ?)',
        [semesterId, mod.name, mod.code, `Essential module for ${mod.name}`]
      );
    }
  }
}

async function smartSeed() {
  try {
    await prepareDatabase();

    const schools = await query('SELECT * FROM schools');
    let fieldsAdded = 0;

    console.log(`\n🏫 Found ${schools.length} schools to process. Beginning smart mapping...`);

    for (const school of schools) {
      const schoolTypeKey = determineSchoolType(school);
      const targetFields = ACADEMIC_MAPPING[schoolTypeKey];

      // Console log for transparency
      // console.log(`Mapping ${school.name} -> Target Type: ${schoolTypeKey}`);

      for (const field of targetFields) {
        try {
          // Check if exists to be ultra safe, even though we truncated
          const exists = await query('SELECT id FROM fields WHERE school_id = ? AND name = ?', [school.id, field.name]);
          
          if (exists.length === 0) {
            const result = await query(
              'INSERT INTO fields (school_id, name, description) VALUES (?, ?, ?)',
              [school.id, field.name, field.desc]
            );
            fieldsAdded++;
            
            // Immediately generate semesters and modules for this field
            await generateSemestersAndModules(result.insertId, field.name);
          }
        } catch (e) {
          console.error(`Error inserting field ${field.name} for school ${school.id}:`, e.message);
        }
      }
    }

    const modCount = await query('SELECT COUNT(*) as total FROM modules');
    console.log(`\n🎉 Smart Seeding Complete!`);
    console.log(`✔️ Added ${fieldsAdded} accurate Moroccan Fields.`);
    console.log(`✔️ Generated ${fieldsAdded * 2} Semesters.`);
    console.log(`✔️ Generated ${modCount[0].total} realistic Modules.`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Critical failure during smart seeding:', err);
    process.exit(1);
  }
}

smartSeed();

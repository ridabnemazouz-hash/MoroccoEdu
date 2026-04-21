const { query } = require('../config/db');

const data = {
  "Casablanca": [
    { "name": "Hassan II University of Casablanca", "short_name": "UH2C", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of Casablanca", "short_name": "ENSA", "code": "ENSA-C", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Casablanca", "short_name": "ENCG", "code": "ENCG-C", "type": "Higher Institute", "is_public": true },
    { "name": "Higher School of Technology Casablanca", "short_name": "ESTC", "code": "EST-C", "type": "Higher Institute", "is_public": true },
    { "name": "Faculty of Medicine and Pharmacy of Casablanca", "short_name": "FMPC", "code": null, "type": "Faculty", "is_public": true },
    { "name": "Faculty of Science Ain Chock", "short_name": "FSAC", "code": null, "type": "Faculty", "is_public": true },
    { "name": "Mohammed VI University of Health Sciences", "short_name": "UM6SS", "code": null, "type": "University", "is_public": false },
    { "name": "Mundiapolis University", "short_name": null, "code": null, "type": "University", "is_public": false },
    { "name": "International University of Casablanca", "short_name": "UIC", "code": null, "type": "University", "is_public": false }
  ],
  "Rabat": [
    { "name": "Mohammed V University", "short_name": "UM5", "code": null, "type": "University", "is_public": true },
    { "name": "Mohammadia School of Engineers", "short_name": "EMI", "code": null, "type": "Engineering School", "is_public": true },
    { "name": "National School of Computer Science and Systems Analysis", "short_name": "ENSIAS", "code": null, "type": "Engineering School", "is_public": true },
    { "name": "National Institute of Posts and Telecommunications", "short_name": "INPT", "code": null, "type": "Engineering School", "is_public": true },
    { "name": "National School of Architecture", "short_name": "ENA", "code": null, "type": "Higher Institute", "is_public": true },
    { "name": "Faculty of Medicine and Pharmacy of Rabat", "short_name": "FMPR", "code": null, "type": "Faculty", "is_public": true },
    { "name": "International University of Rabat", "short_name": "UIR", "code": null, "type": "University", "is_public": false }
  ],
  "Fes": [
    { "name": "Sidi Mohamed Ben Abdellah University", "short_name": "USMBA", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of Fes", "short_name": "ENSA", "code": "ENSA-F", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Fes", "short_name": "ENCG", "code": "ENCG-F", "type": "Higher Institute", "is_public": true },
    { "name": "Faculty of Science and Technology", "short_name": "FST", "code": "FST-F", "type": "Faculty", "is_public": true },
    { "name": "Faculty of Medicine and Pharmacy of Fes", "short_name": "FMPF", "code": null, "type": "Faculty", "is_public": true },
    { "name": "Euromed University of Fes", "short_name": "UEMF", "code": null, "type": "University", "is_public": false }
  ],
  "Marrakech": [
    { "name": "Cadi Ayyad University", "short_name": "UCA", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of Marrakech", "short_name": "ENSA", "code": "ENSA-M", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Marrakech", "short_name": "ENCG", "code": "ENCG-M", "type": "Higher Institute", "is_public": true },
    { "name": "Faculty of Medicine and Pharmacy of Marrakech", "short_name": "FMPM", "code": null, "type": "Faculty", "is_public": true },
    { "name": "Faculty of Science and Technology Marrakech", "short_name": "FST", "code": "FST-M", "type": "Faculty", "is_public": true }
  ],
  "Agadir": [
    { "name": "Ibn Zohr University", "short_name": "UIZ", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of Agadir", "short_name": "ENSA", "code": "ENSA-A", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Agadir", "short_name": "ENCG", "code": "ENCG-A", "type": "Higher Institute", "is_public": true },
    { "name": "Universiapolis - International University of Agadir", "short_name": null, "code": null, "type": "University", "is_public": false }
  ],
  "Tangier": [
    { "name": "Abdelmalek Essaadi University", "short_name": "UAE", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of Tangier", "short_name": "ENSA", "code": "ENSA-T", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Tangier", "short_name": "ENCG", "code": "ENCG-T", "type": "Higher Institute", "is_public": true },
    { "name": "Faculty of Science and Technology Tangier", "short_name": "FST", "code": "FST-T", "type": "Faculty", "is_public": true }
  ],
  "Oujda": [
    { "name": "Mohammed First University", "short_name": "UMP", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of Oujda", "short_name": "ENSA", "code": "ENSA-O", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Oujda", "short_name": "ENCG", "code": "ENCG-O", "type": "Higher Institute", "is_public": true },
    { "name": "Faculty of Medicine and Pharmacy of Oujda", "short_name": "FMPO", "code": null, "type": "Faculty", "is_public": true }
  ],
  "El Jadida": [
    { "name": "Chouaib Doukkali University", "short_name": "UCD", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of El Jadida", "short_name": "ENSA", "code": "ENSA-J", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of El Jadida", "short_name": "ENCG", "code": "ENCG-J", "type": "Higher Institute", "is_public": true },
    { "name": "Higher School of Education and Training", "short_name": "ESEF", "code": "ESEF-J", "type": "Higher Institute", "is_public": true }
  ],
  "Kenitra": [
    { "name": "Ibn Tofail University", "short_name": "UIT", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Applied Sciences of Kenitra", "short_name": "ENSA", "code": "ENSA-K", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Kenitra", "short_name": "ENCG", "code": "ENCG-K", "type": "Higher Institute", "is_public": true }
  ],
  "Settat": [
    { "name": "Hassan First University", "short_name": "UH1", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Business and Management of Settat", "short_name": "ENCG", "code": "ENCG-S", "type": "Higher Institute", "is_public": true },
    { "name": "Faculty of Science and Technology Settat", "short_name": "FST", "code": "FST-S", "type": "Faculty", "is_public": true }
  ],
  "Meknes": [
    { "name": "Moulay Ismail University", "short_name": "UMI", "code": null, "type": "University", "is_public": true },
    { "name": "National School of Arts and Crafts", "short_name": "ENSAM", "code": "ENSAM-M", "type": "Engineering School", "is_public": true },
    { "name": "National School of Business and Management of Meknes", "short_name": "ENCG", "code": "ENCG-MEK", "type": "Higher Institute", "is_public": true }
  ],
  "Tetouan": [
    { "name": "National School of Applied Sciences of Tetouan", "short_name": "ENSA", "code": "ENSA-TE", "type": "Engineering School", "is_public": true }
  ],
  "Ifrane": [
    { "name": "Al Akhawayn University", "short_name": "AUI", "code": null, "type": "University", "is_public": false }
  ],
  "Benguerir": [
    { "name": "Mohammed VI Polytechnic University", "short_name": "UM6P", "code": null, "type": "University", "is_public": false }
  ]
};

async function seedData() {
  try {
    console.log('🚀 Starting to seed new schools...');

    // Ensure Morocco exists
    await query('INSERT IGNORE INTO countries (name, code) VALUES (?, ?)', ['Morocco', 'MA']);
    const resCountry = await query('SELECT id FROM countries WHERE name = ?', ['Morocco']);
    const countryId = resCountry[0].id;

    let addedCount = 0;

    for (const [cityName, schools] of Object.entries(data)) {
      // Ensure city exists
      await query('INSERT IGNORE INTO cities (country_id, name) VALUES (?, ?)', [countryId, cityName]);
      const resCity = await query('SELECT id FROM cities WHERE name = ? AND country_id = ?', [cityName, countryId]);
      const cityId = resCity[0].id;

      for (const school of schools) {
        // Check if school already exists by name or code to prevent duplicates
        let existing = [];
        if (school.code) {
             existing = await query('SELECT id FROM schools WHERE code = ?', [school.code]);
        } else {
             existing = await query('SELECT id FROM schools WHERE name = ? AND city_id = ?', [school.name, cityId]);
        }

        if (existing.length === 0) {
          await query(
            'INSERT INTO schools (name, short_name, code, city_id, type, is_public) VALUES (?, ?, ?, ?, ?, ?)',
            [school.name, school.short_name, school.code, cityId, school.type, school.is_public ? 1 : 0]
          );
          addedCount++;
          console.log(`✅ Added: ${school.name} (${cityName})`);
        } else {
          // Update city_id just in case for existing ones
          await query('UPDATE schools SET city_id = ? WHERE id = ?', [cityId, existing[0].id]);
        }
      }
    }

    console.log(`\n🎉 Seeding complete! Added ${addedCount} new institutions.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

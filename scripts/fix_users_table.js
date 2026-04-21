const { query } = require('../config/db');

async function fixUsersTable() {
  console.log('🔄 Checking users table for missing columns...');
  try {
    // Try to add google_id
    try {
      await query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE DEFAULT NULL AFTER password_hash');
      console.log('✅ Added google_id column');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('ℹ️ google_id already exists');
      } else {
        throw err;
      }
    }

    // Try to add facebook_id
    try {
      await query('ALTER TABLE users ADD COLUMN facebook_id VARCHAR(255) UNIQUE DEFAULT NULL AFTER google_id');
      console.log('✅ Added facebook_id column');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('ℹ️ facebook_id already exists');
      } else {
        throw err;
      }
    }

    console.log('🎉 Fix completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error fixing table:', err.message);
    process.exit(1);
  }
}

fixUsersTable();

const mysql = require('mysql2/promise');
require('dotenv').config();

const migrate = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });

    try {
        console.log('🔄 Updating users table...');
        
        // 1. Add google_id and facebook_id
        await connection.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) DEFAULT NULL,
            ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255) DEFAULT NULL
        `);

        // 2. Make password_hash nullable
        await connection.query(`
            ALTER TABLE users 
            MODIFY COLUMN password_hash VARCHAR(255) NULL
        `);

        console.log('✅ Users table updated successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await connection.end();
    }
};

migrate();

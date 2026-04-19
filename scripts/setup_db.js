const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const setupDatabase = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('🏗️  Starting full database initialization...');

        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon, but filter out empty statements
        const queries = schema
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`📜 Executing ${queries.length} schema queries...`);

        for (const sql of queries) {
            try {
                await connection.query(sql);
            } catch (err) {
                // If it's a "Duplicate key" or "Table already exists", we can often ignore if using IF NOT EXISTS
                if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
                    console.warn(`⚠️  Warning executing query: ${err.message}`);
                }
            }
        }

        console.log('✅ Schema applied successfully!');

        // Seed Roles directly
        console.log('📋 Seeding roles...');
        const roles = ['student', 'professor', 'admin'];
        for (const role of roles) {
            await connection.query('INSERT IGNORE INTO roles (name) VALUES (?)', [role]);
        }
        console.log('✅ Roles seeded');

        process.exit(0);
    } catch (err) {
        console.error('❌ Database setup failed:', err);
        process.exit(1);
    } finally {
        if (connection) connection.release();
    }
};

setupDatabase();

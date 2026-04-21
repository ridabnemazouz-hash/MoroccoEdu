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
        console.log('🏗️  Creating school_reviews table...');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS school_reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                school_id INT NOT NULL,
                user_id INT NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_school_review (user_id, school_id),
                FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        console.log('✅ school_reviews table created successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await connection.end();
    }
};

migrate();

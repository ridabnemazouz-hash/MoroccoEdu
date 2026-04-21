const { pool } = require('../config/db');

const addRefreshTokensTable = async () => {
  try {
    console.log('🔄 Adding refresh_tokens table...');
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_token (user_id, token_hash(10))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ refresh_tokens table created successfully');
  } catch (error) {
    console.error('❌ Error creating refresh_tokens table:', error);
    throw error;
  }
};

// Run migration if executed directly
if (require.main === module) {
  addRefreshTokensTable()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { addRefreshTokensTable };

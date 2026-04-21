const { query } = require('../config/db');
const logger = require('../config/logger');

async function addAdditionalIndexes() {
  const indexes = [
    // Covering indexes for common queries
    {
      name: 'idx_resources_covering_list',
      table: 'resources',
      columns: 'module_id, created_at DESC, views, type',
      reason: 'Covering index for resource listing - avoids table lookup'
    },
    {
      name: 'idx_reactions_count_lookup',
      table: 'reactions',
      columns: 'resource_id, type, id',
      reason: 'Covering index for reaction counting'
    },
    {
      name: 'idx_comments_resource_lookup',
      table: 'comments',
      columns: 'resource_id, created_at DESC, user_id',
      reason: 'Covering index for comment retrieval'
    }
  ];

  logger.info('Starting additional database index migration...');
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const index of indexes) {
    try {
      // Check if index already exists
      const existing = await query(
        `SELECT INDEX_NAME FROM information_schema.STATISTICS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = ? 
         AND INDEX_NAME = ?`,
        [index.table, index.name]
      );

      if (existing.length > 0) {
        logger.info(`Index ${index.name} already exists on ${index.table}, skipping...`);
        skipCount++;
        continue;
      }

      // Create index
      await query(
        `CREATE INDEX ${index.name} ON ${index.table} (${index.columns})`,
        []
      );

      logger.info(`✓ Created index ${index.name} on ${index.table}(${index.columns}) - ${index.reason}`);
      successCount++;
    } catch (error) {
      logger.error(`✗ Failed to create index ${index.name} on ${index.table}:`, error.message);
      errorCount++;
    }
  }

  logger.info('\n=== Additional Index Migration Summary ===');
  logger.info(`Total indexes: ${indexes.length}`);
  logger.info(`Created: ${successCount}`);
  logger.info(`Skipped (already exist): ${skipCount}`);
  logger.info(`Failed: ${errorCount}`);
  logger.info('==========================================\n');

  return {
    total: indexes.length,
    created: successCount,
    skipped: skipCount,
    failed: errorCount
  };
}

// Run migration if executed directly
if (require.main === module) {
  addAdditionalIndexes()
    .then((result) => {
      logger.info('Additional index migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Additional index migration failed:', error);
      process.exit(1);
    });
}

module.exports = addAdditionalIndexes;

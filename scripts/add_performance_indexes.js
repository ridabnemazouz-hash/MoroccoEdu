const { query } = require('../config/db');
const logger = require('../config/logger');

async function addPerformanceIndexes() {
  const indexes = [
    // Resources table indexes
    {
      name: 'idx_resources_module_id',
      table: 'resources',
      columns: 'module_id',
      reason: 'Speed up module resource queries'
    },
    {
      name: 'idx_resources_user_id',
      table: 'resources',
      columns: 'user_id',
      reason: 'Speed up user resource queries'
    },
    {
      name: 'idx_resources_created_at',
      table: 'resources',
      columns: 'created_at DESC',
      reason: 'Optimize ORDER BY created_at queries'
    },
    {
      name: 'idx_resources_views',
      table: 'resources',
      columns: 'views DESC',
      reason: 'Optimize trending resource queries'
    },
    {
      name: 'idx_resources_type',
      table: 'resources',
      columns: 'type',
      reason: 'Speed up type filtering'
    },
    {
      name: 'idx_resources_module_created',
      table: 'resources',
      columns: 'module_id, created_at DESC',
      reason: 'Composite index for module resource listing'
    },

    // Reactions table indexes
    {
      name: 'idx_reactions_resource_id',
      table: 'reactions',
      columns: 'resource_id',
      reason: 'Speed up reaction count queries'
    },
    {
      name: 'idx_reactions_user_resource',
      table: 'reactions',
      columns: 'user_id, resource_id',
      reason: 'Prevent duplicate reactions and speed up user reaction checks'
    },
    {
      name: 'idx_reactions_resource_type',
      table: 'reactions',
      columns: 'resource_id, type',
      reason: 'Optimize reaction count by type queries'
    },

    // Comments table indexes
    {
      name: 'idx_comments_resource_id',
      table: 'comments',
      columns: 'resource_id',
      reason: 'Speed up comment retrieval for resources'
    },
    {
      name: 'idx_comments_user_id',
      table: 'comments',
      columns: 'user_id',
      reason: 'Speed up user comment queries'
    },
    {
      name: 'idx_comments_parent_id',
      table: 'comments',
      columns: 'parent_id',
      reason: 'Speed up nested comment queries'
    },
    {
      name: 'idx_comments_created_at',
      table: 'comments',
      columns: 'created_at DESC',
      reason: 'Optimize comment sorting'
    },

    // Users table indexes
    {
      name: 'idx_users_email',
      table: 'users',
      columns: 'email',
      reason: 'Speed up email lookups for authentication'
    },
    {
      name: 'idx_users_role',
      table: 'users',
      columns: 'role',
      reason: 'Speed up role-based queries'
    },

    // Modules table indexes
    {
      name: 'idx_modules_semester_id',
      table: 'modules',
      columns: 'semester_id',
      reason: 'Speed up semester module queries'
    },

    // Semesters table indexes
    {
      name: 'idx_semesters_field_id',
      table: 'semesters',
      columns: 'field_id',
      reason: 'Speed up field semester queries'
    },

    // Fields table indexes
    {
      name: 'idx_fields_school_id',
      table: 'fields',
      columns: 'school_id',
      reason: 'Speed up school field queries'
    },

    // Refresh tokens indexes
    {
      name: 'idx_refresh_tokens_user_id',
      table: 'refresh_tokens',
      columns: 'user_id',
      reason: 'Speed up refresh token lookups'
    },
    {
      name: 'idx_refresh_tokens_expires_at',
      table: 'refresh_tokens',
      columns: 'expires_at',
      reason: 'Speed up expired token cleanup'
    }
  ];

  logger.info('Starting database performance index migration...');
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

  logger.info('\n=== Migration Summary ===');
  logger.info(`Total indexes: ${indexes.length}`);
  logger.info(`Created: ${successCount}`);
  logger.info(`Skipped (already exist): ${skipCount}`);
  logger.info(`Failed: ${errorCount}`);
  logger.info('========================\n');

  return {
    total: indexes.length,
    created: successCount,
    skipped: skipCount,
    failed: errorCount
  };
}

// Run migration if executed directly
if (require.main === module) {
  addPerformanceIndexes()
    .then((result) => {
      logger.info('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addPerformanceIndexes;

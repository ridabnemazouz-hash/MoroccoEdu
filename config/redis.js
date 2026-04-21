const Redis = require('ioredis');
const logger = require('./logger');

let redisClient;

// Initialize Redis connection
const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = new Redis(redisUrl, {
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('Redis: Max retries reached, giving up');
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Redis: Reconnecting in ${delay}ms (attempt ${times})`);
        return delay;
      },
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000
    });

    redisClient.on('error', (error) => {
      logger.error('Redis error:', error.message);
    });

    redisClient.on('connect', () => {
      logger.info('Redis: Connected successfully');
    });

    redisClient.on('ready', () => {
      logger.info('Redis: Client ready');
    });

    redisClient.on('close', () => {
      logger.warn('Redis: Connection closed');
    });

    // Test connection
    await redisClient.connect();
    await redisClient.ping();
    logger.info('Redis: Connection verified with PONG');
    
    return redisClient;
  } catch (error) {
    logger.error('Redis: Failed to connect:', error.message);
    redisClient = null;
    return null;
  }
};

// Get Redis client instance
const getRedisClient = () => {
  return redisClient;
};

// Cache helper functions
const cache = {
  // Get cached value
  async get(key) {
    if (!redisClient) return null;
    
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error.message);
      return null;
    }
  },

  // Set cached value with expiration
  async set(key, value, ttl = 3600) {
    if (!redisClient) return false;
    
    try {
      const serialized = JSON.stringify(value);
      await redisClient.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error.message);
      return false;
    }
  },

  // Delete cached value
  async del(key) {
    if (!redisClient) return false;
    
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error.message);
      return false;
    }
  },

  // Delete multiple keys by pattern
  async delPattern(pattern) {
    if (!redisClient) return false;
    
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        logger.info(`Redis: Deleted ${keys.length} keys matching pattern: ${pattern}`);
      }
      return true;
    } catch (error) {
      logger.error(`Redis DEL pattern error for ${pattern}:`, error.message);
      return false;
    }
  },

  // Check if key exists
  async exists(key) {
    if (!redisClient) return false;
    
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error.message);
      return false;
    }
  },

  // Set cache only if not exists (for locks)
  async setnx(key, value, ttl = 60) {
    if (!redisClient) return false;
    
    try {
      const result = await redisClient.setnx(key, value);
      if (result === 1) {
        await redisClient.expire(key, ttl);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Redis SETNX error for key ${key}:`, error.message);
      return false;
    }
  },

  // Increment counter
  async incr(key, ttl = 3600) {
    if (!redisClient) return null;
    
    try {
      const value = await redisClient.incr(key);
      // Set expiration only on first increment
      if (value === 1) {
        await redisClient.expire(key, ttl);
      }
      return value;
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error.message);
      return null;
    }
  },

  // Flush all cache (use with caution!)
  async flush() {
    if (!redisClient) return false;
    
    try {
      await redisClient.flushdb();
      logger.warn('Redis: Database flushed');
      return true;
    } catch (error) {
      logger.error('Redis FLUSH error:', error.message);
      return false;
    }
  }
};

// Cache key generators
const cacheKeys = {
  // Resource cache keys
  resource: (id) => `resource:${id}`,
  resourceList: (moduleId, limit, offset) => `resources:module:${moduleId}:${limit}:${offset}`,
  trendingResources: (limit, offset) => `resources:trending:${limit}:${offset}`,
  
  // Comment cache keys
  comments: (resourceId) => `comments:${resourceId}`,
  
  // User cache keys
  user: (id) => `user:${id}`,
  userProfile: (id) => `user:profile:${id}`,
  
  // School/Module cache keys
  schools: () => 'schools:list',
  schoolDetail: (id) => `school:${id}`,
  modules: (semesterId) => `modules:semester:${semesterId}`,
  
  // Search cache keys
  search: (query, filters) => {
    const filterStr = JSON.stringify(filters);
    return `search:${query}:${filterStr}`;
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  cache,
  cacheKeys
};

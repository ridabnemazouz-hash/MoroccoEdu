const { cache, cacheKeys } = require('../config/redis');
const logger = require('../config/logger');

/**
 * Cache middleware for GET requests
 * @param {string} keyGenerator - Function to generate cache key from request
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 * @param {boolean} skipIfAuth - Skip caching if user is authenticated (default: false)
 */
const cacheMiddleware = (keyGenerator, ttl = 3600, skipIfAuth = false) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for authenticated requests if configured
    if (skipIfAuth && req.user) {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator(req);
      
      // Try to get cached response
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      logger.debug(`Cache MISS: ${cacheKey}`);
      
      // Store original res.json to intercept response
      const originalJson = res.json.bind(res);
      
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode === 200) {
          cache.set(cacheKey, body, ttl).catch((error) => {
            logger.error(`Failed to cache response for ${cacheKey}:`, error.message);
          });
        }
        
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error.message);
      // Continue without caching on error
      next();
    }
  };
};

/**
 * Invalidate cache middleware
 * @param {string|string[]} patterns - Cache key patterns to invalidate
 */
const invalidateCache = (patterns) => {
  return async (req, res, next) => {
    try {
      const patternArray = Array.isArray(patterns) ? patterns : [patterns];
      
      for (const pattern of patternArray) {
        await cache.delPattern(pattern);
      }
      
      logger.info(`Cache invalidated for patterns: ${patternArray.join(', ')}`);
    } catch (error) {
      logger.error('Cache invalidation error:', error.message);
    }
    
    next();
  };
};

/**
 * Cache key generators for common routes
 */
const keyGenerators = {
  // Resource routes
  resourceById: (req) => cacheKeys.resource(req.params.resourceId),
  resourcesByModule: (req) => {
    const { moduleId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    return cacheKeys.resourceList(moduleId, limit, offset);
  },
  trendingResources: (req) => {
    const { limit = 20, offset = 0 } = req.query;
    return cacheKeys.trendingResources(limit, offset);
  },
  
  // Comment routes
  comments: (req) => cacheKeys.comments(req.params.resourceId),
  
  // School routes
  schools: () => cacheKeys.schools(),
  schoolDetail: (req) => cacheKeys.schoolDetail(req.params.id),
  
  // Generic key generator from query params
  fromQuery: (prefix) => (req) => {
    const queryStr = JSON.stringify(req.query);
    return `${prefix}:${queryStr}`;
  }
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  keyGenerators
};

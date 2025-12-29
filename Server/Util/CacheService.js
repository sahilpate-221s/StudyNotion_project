// const { getRedisClient } = require('../Configuration/Redis');

// class CacheService {
//   constructor() {
//     this.redisClient = getRedisClient();
//     this.defaultTTL = 3600; // 1 hour default TTL
//   }

//   // Check if Redis is available
//   isRedisAvailable() {
//     return this.redisClient !== null && this.redisClient.isReady;
//   }

//   // Generate cache key
//   generateKey(prefix, ...params) {
//     return `${prefix}:${params.join(':')}`;
//   }

//   // Get data from cache
//   async get(key) {
//     if (!this.isRedisAvailable()) {
//       return null;
//     }

//     try {
//       const data = await this.redisClient.get(key);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       // console.log('Redis GET error:', error.message);
//       return null;
//     }
//   }

//   // Set data in cache
//   async set(key, data, ttl = this.defaultTTL) {
//     if (!this.isRedisAvailable()) {
//       return false;
//     }

//     try {
//       await this.redisClient.setEx(key, ttl, JSON.stringify(data));
//       return true;
//     } catch (error) {
//       // console.log('Redis SET error:', error.message);
//       return false;
//     }
//   }

//   // Delete data from cache
//   async del(key) {
//     if (!this.isRedisAvailable()) {
//       return false;
//     }

//     try {
//       await this.redisClient.del(key);
//       return true;
//     } catch (error) {
//       // console.log('Redis DEL error:', error.message);
//       return false;
//     }
//   }

//   // Delete multiple keys with pattern
//   async delPattern(pattern) {
//     if (!this.isRedisAvailable()) {
//       return false;
//     }

//     try {
//       const keys = await this.redisClient.keys(pattern);
//       if (keys.length > 0) {
//         await this.redisClient.del(keys);
//       }
//       return true;
//     } catch (error) {
//       // console.log('Redis DEL PATTERN error:', error.message);
//       return false;
//     }
//   }

//   // Cache wrapper function
//   async cacheOrExecute(key, fetchFunction, ttl = this.defaultTTL) {
//     // Try to get from cache first
//     const cachedData = await this.get(key);
//     if (cachedData !== null) {
//       // console.log(`Cache HIT for key: ${key}`);
//       return cachedData;
//     }

//     // If not in cache, execute the function and cache the result
//     // console.log(`Cache MISS for key: ${key}`);
//     const data = await fetchFunction();
    
//     if (data !== null && data !== undefined) {
//       await this.set(key, data, ttl);
//     }
    
//     return data;
//   }

//   // Invalidate cache patterns
//   async invalidatePattern(pattern) {
//     return await this.delPattern(pattern);
//   }

//   // Course-specific cache methods
//   async getCourseDetails(courseId) {
//     const key = this.generateKey('course', 'details', courseId);
//     return await this.get(key);
//   }

//   async setCourseDetails(courseId, data, ttl = 1800) { // 30 minutes
//     const key = this.generateKey('course', 'details', courseId);
//     return await this.set(key, data, ttl);
//   }

//   async invalidateCourseCache(courseId) {
//     const patterns = [
//       `course:details:${courseId}`,
//       `course:list:*`,
//       `category:*`
//     ];
    
//     for (const pattern of patterns) {
//       await this.delPattern(pattern);
//     }
//   }

//   // Category-specific cache methods
//   async getCategories() {
//     const key = this.generateKey('category', 'all');
//     return await this.get(key);
//   }

//   async setCategories(data, ttl = 3600) { // 1 hour
//     const key = this.generateKey('category', 'all');
//     return await this.set(key, data, ttl);
//   }

//   async getCategoryDetails(categoryId) {
//     const key = this.generateKey('category', 'details', categoryId);
//     return await this.get(key);
//   }

//   async setCategoryDetails(categoryId, data, ttl = 1800) { // 30 minutes
//     const key = this.generateKey('category', 'details', categoryId);
//     return await this.set(key, data, ttl);
//   }

//   // Course list cache methods
//   async getAllCourses() {
//     const key = this.generateKey('course', 'all');
//     return await this.get(key);
//   }

//   async setAllCourses(data, ttl = 900) { // 15 minutes
//     const key = this.generateKey('course', 'all');
//     return await this.set(key, data, ttl);
//   }

//   // User-specific cache methods
//   async getUserCourses(userId) {
//     const key = this.generateKey('user', 'courses', userId);
//     return await this.get(key);
//   }

//   async setUserCourses(userId, data, ttl = 600) { // 10 minutes
//     const key = this.generateKey('user', 'courses', userId);
//     return await this.set(key, data, ttl);
//   }

//   async invalidateUserCache(userId) {
//     const patterns = [
//       `user:courses:${userId}`,
//       `user:profile:${userId}`
//     ];
    
//     for (const pattern of patterns) {
//       await this.delPattern(pattern);
//     }
//   }
// }

// module.exports = new CacheService();




const { getRedisClient } = require("../Configuration/Redis");

class CacheService {
  get client() {
    return getRedisClient();
  }

  isReady() {
    return this.client && this.client.isReady;
  }

  generateKey(...parts) {
    return parts.join(":");
  }

  async get(key) {
    if (!this.isReady()) return null;

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  async set(key, value, ttl = 300) {
    if (!this.isReady()) return;

    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttl,
      });
    } catch (err) {
      // silent fail
    }
  }

  async cacheOrExecute(key, fetchFn, ttl = 300) {
    const cached = await this.get(key);
    if (cached !== null) return cached;

    const fresh = await fetchFn();
    if (fresh !== undefined && fresh !== null) {
      await this.set(key, fresh, ttl);
    }
    return fresh;
  }

  async invalidatePattern(pattern) {
    if (!this.isReady()) return;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (err) {}
  }

  // Course-specific cache invalidation
  async invalidateCourseCache(courseId) {
    const patterns = [
      `course:details:${courseId}`,
      `course:list:*`,
      `category:*`
    ];

    for (const pattern of patterns) {
      await this.invalidatePattern(pattern);
    }
  }

  // User-specific cache invalidation
  async invalidateUserCache(userId) {
    const patterns = [
      `user:courses:${userId}`,
      `user:profile:${userId}`,
      `user:enrolled:${userId}`,
      `instructor:dashboard:${userId}`,
      `instructor:courses:${userId}`
    ];

    for (const pattern of patterns) {
      await this.invalidatePattern(pattern);
    }
  }
}

module.exports = new CacheService();

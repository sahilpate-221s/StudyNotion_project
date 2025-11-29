const { createClient } = require('redis');
require('dotenv').config();

let redisClient = null;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        lazyConnect: true,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('Redis connection failed after 3 attempts. Continuing without Redis caching.');
            return false; // Stop retrying
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      // Only log the first error to avoid spam
      if (!redisClient._errorLogged) {
        console.log('Redis not available - continuing without caching:', err.message);
        redisClient._errorLogged = true;
      }
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected - Caching enabled');
      redisClient._errorLogged = false; // Reset error flag on successful connection
    });

    redisClient.on('ready', () => {
      console.log('Redis Client Ready - Caching active');
    });

    redisClient.on('end', () => {
      console.log('Redis Client Disconnected');
    });

    // Try to connect with timeout
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
      )
    ]);
    
    return redisClient;
  } catch (error) {
    console.log('Redis not available - Application will work without caching');
    // Return null if Redis is not available - app should still work
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis
};

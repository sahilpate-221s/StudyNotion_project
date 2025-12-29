const { createClient } = require("redis");

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("❌ Redis Client Error:", err);
    });

    await redisClient.connect();

    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    process.exit(1); // fail fast in prod
  }
};

const getRedisClient = () => redisClient;

module.exports = {
  connectRedis,
  getRedisClient,
};

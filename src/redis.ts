import Redis from "ioredis";

const RedisClient = new Redis(process.env.REDIS_URL);
export default RedisClient;

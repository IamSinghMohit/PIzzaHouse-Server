import Redis from "ioredis";

const RedisClient = new Redis(`${process.env.REDIS_URL}`, {
    maxRetriesPerRequest: null,
});
export default RedisClient;

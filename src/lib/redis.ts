import Redis from "ioredis";

const RedisClient = new Redis({
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
    maxRetriesPerRequest: null,
});

export default RedisClient;

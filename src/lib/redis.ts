import Redis from "ioredis";

// const RedisClient = new Redis(`${process.env.REDIS_URL}`, {
//     maxRetriesPerRequest: null,
// });
//
const RedisClient = new Redis({
    host: "localhost", // Redis server host
    port: 6379, //
    // host: "redis-16436.c274.us-east-1-3.ec2.cloud.redislabs.com",
    // port: 16436,
    // username:"default",
    // password: "8qMobghaiXaPAPmKhgEXwQsGgR8bmrso",
    maxRetriesPerRequest: null,
});
export default RedisClient;

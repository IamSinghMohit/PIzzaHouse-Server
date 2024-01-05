import { Queue } from "bullmq";
import RedisClient from "../redis";

const OrderQueue = new Queue("order-queu", {
    connection: RedisClient,
});

export default OrderQueue

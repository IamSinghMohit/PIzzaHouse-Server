import { Queue, Worker, Job } from "bullmq";
import RedisClient from "../redis";
import { QueueEnum } from "./types/enum";

export const OrderImageUploadQueue = new Queue(
    QueueEnum.ORDER_IMAGE_UPLOAD_QUEUE,
    {
        connection: RedisClient,
    },
);

export const OrderImageUploadQueueWorker = new Worker(
    QueueEnum.ORDER_IMAGE_UPLOAD_QUEUE,
    async (job) => {
        console.log(job.data);
    },
    {
        connection: RedisClient,
    },
);

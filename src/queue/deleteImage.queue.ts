import { Queue, Worker } from "bullmq";
import { QueueEnum } from "./types/enum";
import RedisClient from "@/redis";
import { ImageService } from "@/services";

export const DeleteImaeQueue = new Queue(QueueEnum.DELETE_IMAGE_QUEUE, {
    connection: RedisClient,
});

export const DeleteImaeQueueWorker = new Worker(
    QueueEnum.DELETE_IMAGE_QUEUE,
    async (payload) => {
        console.log(payload);
    },
    {
        connection: RedisClient,
    },
);

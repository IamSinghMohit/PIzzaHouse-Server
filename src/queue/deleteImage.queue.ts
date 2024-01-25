import { Job, Queue, Worker } from "bullmq";
import { QueueEnum } from "./types/enum";
import RedisClient from "@/redis";
import { ImageService } from "@/services";

type TDeleteImageQueuePayload = {
    tag: string;
};
export const DeleteImageQueue = new Queue(QueueEnum.DELETE_IMAGE_QUEUE, {
    connection: RedisClient,
});

export const DeleteImaeQueueWorker = new Worker<TDeleteImageQueuePayload>(
    QueueEnum.DELETE_IMAGE_QUEUE,
    async (payload: Job<TDeleteImageQueuePayload>) => {
        await ImageService.deleteUsingTag(payload.data.tag);
    },
    {
        connection: RedisClient,
    },
);

export async function AddToDeleteImageQueue(data: TDeleteImageQueuePayload) {
    return await DeleteImageQueue.add("delete image queue", data);
}

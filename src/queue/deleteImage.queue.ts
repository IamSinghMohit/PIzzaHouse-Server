import { Job, Queue, Worker } from "bullmq";
import { QueueEnum } from "./types/enum";
import RedisClient from "@/redis";
import { ImageService } from "@/services";

type TDeleteImageQueuePayload = {
    url: string;
};
export const DeleteImageQueue = new Queue(QueueEnum.DELETE_IMAGE_QUEUE, {
    connection: RedisClient,
});

export const DeleteImaeQueueWorker = new Worker<TDeleteImageQueuePayload>(
    QueueEnum.DELETE_IMAGE_QUEUE,
    async (payload: Job<TDeleteImageQueuePayload>) => {
        const imagePath = payload.data.url.split("/");
        if (payload.data.url !== process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL) {
            const image = `${process.env.CLOUDINARY_PRODUCT_FOLDER}/${
                imagePath[imagePath.length - 1].split(".")[0]
            }`;
            await ImageService.deleteUsingId(image);
        }
    },
    {
        connection: RedisClient,
    },
);

export async function AddToDeleteImageQueue(data: TDeleteImageQueuePayload) {
    return await DeleteImageQueue.add("delete image queue", data);
}

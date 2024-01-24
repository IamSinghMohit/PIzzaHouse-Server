import { Queue, Worker } from "bullmq";
import { QueueEnum } from "./types/enum";
import RedisClient from "@/redis";
import { ImageService } from "@/services";

export type TDeleteImageQueuePayload = {
    url:string;
}
export const DeleteImaeQueue = new Queue(QueueEnum.DELETE_IMAGE_QUEUE, {
    connection: RedisClient,
});

export const DeleteImaeQueueWorker = new Worker<TDeleteImageQueuePayload >(
    QueueEnum.DELETE_IMAGE_QUEUE,
    async (payload) => {
            const url = product.image.split("/");

            const image = `${process.env.CLOUDINARY_PRODUCT_FOLDER}/${
                url[url.length - 1].split(".")[0]
            }`;
            await ImageService.deleteImage(image);
    },
    {
        connection: RedisClient,
    },
);

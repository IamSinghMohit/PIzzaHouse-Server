import { Queue, Worker, Job } from "bullmq";
import RedisClient from "../lib/redis";
import { QueueEnum } from "./types";
import cloudinary from "@/helper/cloudinary";
import axios from "axios";
import { ImageService } from "@/services";
import { OrderModel } from "@/modules/order/model/order";
import Logger from "@/lib/logger";

export type TOrderImageUplaodQueuePayload = Array<{
    orderId: string;
    image: string;
}>;

export const OrderImageUploadQueue = new Queue(
    QueueEnum.ORDER_IMAGE_UPLOAD_QUEUE,
    {
        connection: RedisClient,
    },
);

export const OrderImageUploadQueueWorker =
    new Worker<TOrderImageUplaodQueuePayload>(
        QueueEnum.ORDER_IMAGE_UPLOAD_QUEUE,
        async (job) => {
            try {
                const orderArray = job.data;
                // uploading the image
                const imagesArray = await Promise.all(
                    orderArray.map(async (order) => {
                        const imageBuffer = await axios
                            .get<Buffer>(cloudinary.url(order.image), {
                                responseType: "arraybuffer",
                            })
                            .then((res) => res.data);
                        return ImageService.uploadImageWithBuffer(
                            process.env.CLOUDINARY_ORDER_FOLDER!,
                            imageBuffer as unknown as Buffer,
                        );
                    }),
                );
                const arrayWithOrderAndImages = imagesArray.map(
                    (image, index) => ({
                        image: image.public_id,
                        orderId: orderArray[index].orderId,
                    }),
                );
                // adding tags
                await Promise.all([
                    ...arrayWithOrderAndImages.map((order) => {
                        return ImageService.addTag(`orderId:${order.orderId}`, [
                            order.image,
                        ]);
                    }),
                    ...arrayWithOrderAndImages.map((order) => {
                        return OrderModel.updateOne(
                            {
                                _id: order.orderId,
                            },
                            {
                                image: order.image,
                            },
                        );
                    }),
                ]);
            } catch (error) {
                Logger.error(error);
            }
        },
        {
            connection: RedisClient,
        },
    );

export async function AddToOrderImageUploadQueue(
    imageArray: TOrderImageUplaodQueuePayload,
) {
    await OrderImageUploadQueue.add("order image upload", imageArray);
}

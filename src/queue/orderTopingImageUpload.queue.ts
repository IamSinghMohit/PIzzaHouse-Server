import { Queue, Worker } from "bullmq";
import { QueueEnum } from "./types";
import RedisClient from "@/redis";
import axios from "axios";
import cloudinary from "@/helper/cloudinary";
import { ImageService } from "@/services";
import { OrderTopingModel } from "@/modules/order/model/orderTopings";

export type TOrderTopingImageUplaodQueuePayload = Array<{
    orderTopingId: string;
    image: string;
}>;

export const OrderTopingImageUploadQueue = new Queue(
    QueueEnum.ORDER_TOPING_IMAGE_UPLOAD_QUEUE,
    {
        connection: RedisClient,
    },
);

export const OrderTopingImageUploadQueueWorker =
    new Worker<TOrderTopingImageUplaodQueuePayload>(
        QueueEnum.ORDER_TOPING_IMAGE_UPLOAD_QUEUE,
        async (job) => {
            try {
                const orderTopingArray = job.data;
                // uploading the image
                const imagesArray = await Promise.all(
                    orderTopingArray.map(async (order) => {
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
                const arrayWithOrderTopingAndImage = imagesArray.map(
                    (image, index) => ({
                        image: image.public_id,
                        orderTopingId: orderTopingArray[index].orderTopingId,
                    }),
                );
                // adding tags
                await Promise.all([
                    ...arrayWithOrderTopingAndImage.map((order) => {
                        return ImageService.addTag(
                            `orderTopingId:${order.orderTopingId}`,
                            [order.image],
                        );
                    }),
                    ...arrayWithOrderTopingAndImage.map((order) => {
                        return OrderTopingModel.updateOne(
                            {
                                _id: order.orderTopingId,
                            },
                            {
                                image: order.image,
                            },
                        );
                    }),
                ]);
            } catch (error) {
                console.log(error);
            }
        },
        {
            connection: RedisClient,
        },
    );

export async function AddToOrderTopingImageUploadQueue(
    data: TOrderTopingImageUplaodQueuePayload,
) {
    await OrderTopingImageUploadQueue.add("order toping image upload", data);
}

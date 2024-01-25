import { Job, Queue, Worker } from "bullmq";
import { QueueEnum } from "./types/enum";
import RedisClient from "@/redis";
import { ImageService } from "@/services";
import { ProductModel } from "@/modules/products/models/product.model";

type TProductImageUploadQueuePayload = {
    categoryId: string;
    productId: string;
    productBufferRedisKey: string;
};

const ProductImageUploadQueue = new Queue(
    QueueEnum.PRODUCT_IMAGE_UPLOAD_QUEUE,
    {
        connection: RedisClient,
    },
);

export const ProductImageQueueWorker =
    new Worker<TProductImageUploadQueuePayload>(
        QueueEnum.PRODUCT_IMAGE_UPLOAD_QUEUE,
        async (payload) => {
            const { productId, productBufferRedisKey, categoryId } =
                payload.data;
            const buffer = await RedisClient.getBuffer(productBufferRedisKey);
            const processedImage = await ImageService.compressImageToBuffer(
                buffer!,
            );

            const folder = `${process.env.CLOUDINARY_CAEGORY_FOLDER}`;
            const result = await ImageService.uploadImageWithBuffer(
                folder,
                processedImage,
            );
            await Promise.all([
                await ImageService.addTag(`categoryId:${categoryId}`, [
                    result.public_id,
                ]),
                await ImageService.addTag(`product_id:${productId}`, [
                    result.public_id,
                ]),
            ]);
            await ProductModel.findOneAndUpdate(
                { _id: productId },
                { image: result.url },
            );
        },
        {
            connection: RedisClient,
        },
    );

export async function AddToProductImageUploadQueue(
    data: TProductImageUploadQueuePayload,
): Promise<Job<TProductImageUploadQueuePayload>> {
    return await ProductImageUploadQueue.add("product image upload", data);
}

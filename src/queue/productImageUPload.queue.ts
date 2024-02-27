import { Job, Queue, Worker } from "bullmq";
import { QueueEnum ,TRedisBufferKey} from "./types";
import RedisClient from "@/lib/redis";
import { ImageService } from "@/services";
import { ProductModel } from "@/modules/products/models/product.model";

type TProductImageUploadQueuePayload = {
    categoryId: string;
    productId: string;
    productBufferRedisKey:TRedisBufferKey;
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

            const folder = `${process.env.CLOUDINARY_PRODUCT_FOLDER}`;
            const result = await ImageService.uploadImageWithBuffer(
                folder,
                processedImage,
            );
            await Promise.all([
                ImageService.addTag(`categoryId:${categoryId}`, [
                    result.public_id,
                ]),
                ImageService.addTag(`productId:${productId}`, [
                    result.public_id,
                ]),
            ]);
            await ProductModel.findOneAndUpdate(
                { _id: productId },
                { image: result.public_id },
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

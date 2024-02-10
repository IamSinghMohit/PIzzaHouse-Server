import { Job, Queue, Worker } from "bullmq";
import RedisClient from "@/redis";
import { ImageService } from "@/services";
import { CategoryModel } from "@/modules/category/models/category.model";
import { TRedisBufferKey,QueueEnum  } from "./types";

type TCategoryImageUploadQueuePayload = {
    categoryBufferRedisKey:TRedisBufferKey;
    categoryId: string;
};

export const CategoryImageUploadQueue = new Queue(
    QueueEnum.CATEGORY_IMAGE_UPLOAD_QUEUE,
    {
        connection: RedisClient,
    },
);

export const CategoryImageUploadQueueWorker =
    new Worker<TCategoryImageUploadQueuePayload>(
        QueueEnum.CATEGORY_IMAGE_UPLOAD_QUEUE,
        async (payload) => {
            try {
                const { categoryBufferRedisKey, categoryId } = payload.data;
                const buffer = await RedisClient.getBuffer(
                    categoryBufferRedisKey,
                );
                const processedImage = await ImageService.compressImageToBuffer(
                    buffer!,
                );
                // Uploading image to cloudinary and creating category
                const folder = `${process.env.CLOUDINARY_CATEGORY_FOLDER}`;
                const result = await ImageService.uploadImageWithBuffer(
                    folder,
                    processedImage,
                );
                await ImageService.addTag(`categoryId:${categoryId}`, [
                    result.public_id,
                ]);
                await CategoryModel.findOneAndUpdate(
                    { _id: categoryId },
                    { image: result.public_id },
                );
            } catch (error) {
                console.log(error);
            }
        },
        {
            connection: RedisClient,
        },
    );

export async function AddToCategoryImageUploadQueue(
    data: TCategoryImageUploadQueuePayload,
): Promise<Job<TCategoryImageUploadQueuePayload>> {
    return await CategoryImageUploadQueue.add("caegory image upload", data);
}

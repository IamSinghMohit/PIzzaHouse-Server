import { Job, Queue, Worker } from "bullmq";
import { QueueEnum } from "./types/enum";
import RedisClient from "@/redis";
import { ImageService } from "@/services";
import { CategoryModel } from "@/modules/category/models/category.model";

type TCategoryImageUploadQueuePayload = {
    categoryBufferRedisKey: string;
    categoryId: string;
};

export const CategoryImageUploadQueue = new Queue(
    QueueEnum.CATEGORY_IMAGE_UPLOAD_QUEUE,
    {
        connection: RedisClient,
    },
);

export const ImageUploadQueueWorker =
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
                const folder = `${process.env.CLOUDINARY_CAEGORY_FOLDER}`;
                const result = await ImageService.uploadImageWithBuffer(
                    folder,
                    processedImage,
                );
                await ImageService.addTag(`categoryId:${categoryId}`, [result.public_id]);
                await CategoryModel.findOneAndUpdate(
                    { _id: categoryId },
                    { image: result.url },
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

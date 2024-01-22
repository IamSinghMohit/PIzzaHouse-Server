import { Queue, Worker } from "bullmq";
import { QueueEnum } from "./types/enum";
import RedisClient from "@/redis";
import { ImageService } from "@/services";
import { CategoryModel } from "@/modules/category/models/category.model";

type TImageUploadProps = {
    imageBuffer: Buffer;
    id: string;
};

export const CategoryImageUploadQueue = new Queue(
    QueueEnum.CATEGORY_IMAGE_UPLOAD_QUEUE,
    {
        connection: RedisClient,
    },
);

export const ImageUploadQueueWorker = new Worker(
    QueueEnum.CATEGORY_IMAGE_UPLOAD_QUEUE,
    async (payload) => {
        try {
            const buffer = await RedisClient.getBuffer(
                payload.data.categoryBufferRedisKey,
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
            await CategoryModel.findOneAndUpdate(
                { _id: payload.data.categoryId },
                { image: result.url },
            );
            payload.remove()
        } catch (error) {
            console.log(error);
        }
    },
    {
        connection: RedisClient,
    },
);

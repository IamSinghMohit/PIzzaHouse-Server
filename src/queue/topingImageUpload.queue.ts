import { Queue, Worker } from "bullmq";
import { QueueEnum ,TRedisBufferKey} from "./types";
import RedisClient from "@/redis";
import { ImageService } from "@/services";
import { TopingModel } from "@/modules/topings/topings.model";

type TTopingImageQueuePayload = {
    topingBufferRedisKey:TRedisBufferKey;
    topingId: string;
    categoryId: string;
};

const TopingImageUploadQueue = new Queue(QueueEnum.TOPING_IMAGE_UPLOAD_QUEUE, {
    connection: RedisClient,
});

export const TopingImageUploadQueueWorker =
    new Worker<TTopingImageQueuePayload>(
        QueueEnum.TOPING_IMAGE_UPLOAD_QUEUE,
        async (payload) => {
            console.log(payload.data);

            const { topingId, topingBufferRedisKey, categoryId } = payload.data;
            const buffer = await RedisClient.getBuffer(topingBufferRedisKey);
            const processedImage = await ImageService.compressImageToBuffer(
                buffer!,
            );

            const folder = `${process.env.CLOUDINARY_TOPING_FOLDER}`;
            const result = await ImageService.uploadImageWithBuffer(
                folder,
                processedImage,
            );
            await Promise.all([
                await ImageService.addTag(`categoryId:${categoryId}`, [
                    result.public_id,
                ]),
                await ImageService.addTag(`topingId:${topingId}`, [
                    result.public_id,
                ]),
            ]);
            await TopingModel.findOneAndUpdate(
                { _id: topingId },
                { image: result.url },
            );
        },
        {
            connection: RedisClient,
        },
    );

export async function AddToTopingImageUploadQueue(
    payload: TTopingImageQueuePayload,
) {
    await TopingImageUploadQueue.add("toping-image-upload", payload);
}

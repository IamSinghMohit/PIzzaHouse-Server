import { Queue, Worker } from "bullmq";
import RedisClient from "../lib/redis";
import { QueueEnum } from "./types";
import { OrderModel } from "@/modules/order/model/order";
import { ImageService } from "@/services";
import Stripe from "stripe";
import { OrderTopingModel } from "@/modules/order/model/orderTopings";
import Logger from "@/lib/logger";
const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

export type TDeleteOrderQueuePayload = {
    orderIds: string[];
    orderTopingsIds: string[];
    sessionId: string;
    jobId: string;
};

export const DeleteOrderQueue = new Queue(QueueEnum.DELETE_ORDER_QUEUE, {
    connection: RedisClient,
});

export const DeleteOrderQueueWorker = new Worker<TDeleteOrderQueuePayload>(
    QueueEnum.DELETE_ORDER_QUEUE,
    async (job) => {
        try {
            await Promise.allSettled([
                OrderModel.deleteMany({
                    _id: { $in: job.data.orderIds },
                }),
                ...job.data.orderIds.map((id) => {
                    return ImageService.deleteUsingTag(`orderId:${id}`);
                }),
                stripe.checkout.sessions.expire(job.data.sessionId),

                OrderTopingModel.deleteMany({
                    _id: { $in: job.data.orderTopingsIds },
                }),
                Promise.all(
                    job.data.orderIds.map((id) => {
                        return ImageService.deleteUsingTag(
                            `orderTopingId:${id}`,
                        );
                    }),
                ),
            ]);
        } catch (error) {
            Logger.error(error)
        }
    },
    {
        connection: RedisClient,
    },
);

export async function AddToDeleteOrderQueue(payload: TDeleteOrderQueuePayload) {
    await DeleteOrderQueue.add("delete order queue", payload, {
        delay: 300000,
        jobId: payload.jobId,
    });
}
export async function DeleteJobFromDeleteOrderQueue(id: string) {
    const job = await DeleteOrderQueue.getJob(id);
    job?.remove();
}

import { Queue, Worker } from "bullmq";
import RedisClient from "../redis";
import { QueueEnum } from "./types";
import { OrderModel } from "@/modules/order/model/order";
import { ImageService } from "@/services";
import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

export type TDeleteOrderQueuePayload = {
    orderIds: string[];
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
            await OrderModel.deleteMany({ _id: { $in: job.data.orderIds } });
            await Promise.all(
                job.data.orderIds.map((id) => {
                    return ImageService.deleteUsingTag(`orderId:${id}`);
                }),
            );
            await stripe.checkout.sessions.expire(job.data.sessionId);
        } catch (error) {
            console.log(error);
        }
    },
    {
        connection: RedisClient,
    },
);

export async function AddToDeleteOrderQueue(payload: TDeleteOrderQueuePayload) {
    await DeleteOrderQueue.add("delete order queue", payload, {
        delay: 3600000,
        jobId: payload.jobId,
    });
}
export async function DeleteJobFromDeleteOrderQueue(id: string) {
    const job = await DeleteOrderQueue.getJob(id);
    job?.remove();
}

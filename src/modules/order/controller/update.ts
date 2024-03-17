import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { EventEmitter } from "@/eventEmitter";
import { DeleteJobFromDeleteOrderQueue } from "@/queue/deleteOrderQueue";
import { CartModel } from "@/modules/auth/models/cart.model";
import { OrderModel } from "../model/order";
import { ResponseService } from "@/services";
import { TOrderStatusSchema } from "../schema/update";
import { TOrderParamIdSchema } from "../schema/main";
import mongoose from "mongoose";
const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

type WebhookMeta = {
    orderIds: string[];
    queueJobId: string;
    userId: string;
};
type StripeWebhookMeta = {
    orderIds: string;
    queueJobId: string;
    userId: string;
};
class OrderUpdate {
    static async OrderWebhook(req: Request, res: Response, next: NextFunction) {
        const sig = req.headers["stripe-signature"]!;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!,
            );
        } catch (err: any) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                const customer = event.data.object.customer_details!;
                const checkoutSessionCompleted = event.data.object
                    .metadata as StripeWebhookMeta;
                const meta: WebhookMeta = {
                    orderIds: JSON.parse(checkoutSessionCompleted.orderIds),
                    queueJobId: checkoutSessionCompleted.queueJobId,
                    userId: checkoutSessionCompleted.userId,
                };
                console.log(meta)
                const session = await mongoose.startSession();
                await session.withTransaction(async () => {
                    await Promise.all([
                        OrderModel.updateMany(
                            { _id: { $in: meta.orderIds } },
                            {
                                $set: {
                                    user_full_name: customer.name,
                                    city: customer.address?.city,
                                    state: customer.address?.state,
                                    address: `${customer.address?.line1} ${customer.address?.line2}`,
                                },
                            },
                            {
                                session,
                            },
                        ),
                        DeleteJobFromDeleteOrderQueue(meta.queueJobId),
                        CartModel.findOneAndUpdate(
                            { user_id: meta.userId },
                            { $push: { orders_ids: { $each: meta.orderIds } } }, // Using $push with $each to push multiple items
                            {
                                session,
                            },
                        ),
                    ]);
                });
                await session.endSession();
                break;
            // ... handle other event types
            default:
        }

        res.send();
    }
    static async orderStatus(
        req: Request<TOrderParamIdSchema, {}, TOrderStatusSchema, {}>,
        res: Response,
        next: NextFunction,
    ) {
        await OrderModel.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                status: req.body.status,
            },
        );
        EventEmitter.emit("update_status", {
            roomId: req.params.id,
            data: req.body,
        });
        ResponseService.sendResponse(res, 200, true, "updated successfully");
    }
}
export default OrderUpdate;

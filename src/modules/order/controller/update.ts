import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { EventEmitter } from "@/eventEmitter";
import { DeleteJobFromDeleteOrderQueue } from "@/queue/deleteOrderQueue";
import { CartModel } from "@/modules/auth/models/cart.model";
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
                const checkoutSessionCompleted = event.data.object
                    .metadata as StripeWebhookMeta;
                const meta: WebhookMeta = {
                    orderIds: JSON.parse(checkoutSessionCompleted.orderIds),
                    queueJobId: checkoutSessionCompleted.queueJobId,
                    userId: checkoutSessionCompleted.userId,
                };
                await DeleteJobFromDeleteOrderQueue(meta.queueJobId);
                await CartModel.findOneAndUpdate(
                    { user_id: meta.userId },
                    { $push: { orders_ids: { $each: meta.orderIds } } }, // Using $push with $each to push multiple items
                );
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.send();
    }
    static async orderStatus(req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        EventEmitter.emit("update_status", {
            roomId: req.params.id,
            data: req.body,
        });
        res.send();
    }
}
export default OrderUpdate;

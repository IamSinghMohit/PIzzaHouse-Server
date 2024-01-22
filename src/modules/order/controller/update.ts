import RedisClient from "@/redis";
import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { OrderModel } from "../model/order";
import { ErrorResponse } from "@/utils";
import { TOrderObject } from "../schema/main";
import { OrderDetailsModel } from "../model/orderDetails";
import { EventEmitter } from "@/eventEmitter";
const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

class OrderUpdate {
    static async OrderWebhook(req: Request, res: Response, next: NextFunction) {
        const sig = req.headers["stripe-signature"] as string;

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET || "",
            );
        } catch (err: any) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            console.log(err);
            return;
        }

        // Handle the event
        switch (event.type) {
            case "payment_intent.payment_failed":
                const paymentIntentPaymentFailed = event.data.object;
                break;
            case "payment_intent.succeeded":
                const paymentIntentSucceeded = event.data.object;
                const OrderObject = (await RedisClient.get(
                    paymentIntentSucceeded.metadata.order_redis_key,
                ).then((res) => JSON.parse(res || "") || null)) as TOrderObject;
                console.log(OrderObject);
                if (!OrderObject) {
                    return;
                }
                await OrderModel.create(OrderObject.order);
                await OrderDetailsModel.create(OrderObject.order_detail);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.send();
    }
    static async orderStatus(req: Request, res: Response, next: NextFunction) {
        console.log(req.body)
        EventEmitter.emit("update_status", {
            roomId: req.params.id,
            data:req.body,
        });
        res.send()
    }
}
export default OrderUpdate;

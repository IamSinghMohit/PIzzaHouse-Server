import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { OrderModel } from "../model/order";
import { TOrderObject } from "../schema/main";
import { OrderDetailsModel } from "../model/orderDetails";
import { EventEmitter } from "@/eventEmitter";
import { CartModel } from "@/modules/auth/models/cart.model";
import mongoose from "mongoose";
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
            case "payment_intent.succeeded":
                const paymentIntentSucceeded = event.data.object;

                const order =
                    paymentIntentSucceeded.metadata as unknown as TOrderObject;
                const topings = JSON.parse(
                    paymentIntentSucceeded.metadata.toping,
                );
                const product_sections = JSON.parse(
                    paymentIntentSucceeded.metadata.product_sections,
                );

                const session = await mongoose.startSession();
                session.startTransaction();
                try {
                    const orderDetails = await OrderDetailsModel.create(
                        [
                            {
                                toping: topings,
                                product_sections: product_sections,
                                product_name: order.product_name,
                            },
                        ],
                        { session },
                    );
                    const newOrder = await OrderModel.create(
                        [
                            {
                                order_details: orderDetails[0]._id,
                                price: order.price,
                                user_full_name: order.user_full_name,
                                image: order.image,
                                address: order.address,
                                city: order.city,
                                state: order.state,
                                quantity: order.quantity,
                                status: order.status,
                            },
                        ],
                        { session },
                    );
                    await CartModel.updateOne(
                        {
                            user_id: order.user_id,
                        },
                        { $push: { orders_ids: newOrder[0]._id } },
                    ).session(session);

                    await session.commitTransaction();
                } catch (error) {
                    await session.abortTransaction();
                } finally {
                    await session.endSession();
                }

                break;
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

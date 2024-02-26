import { NextFunction, Request, Response } from "express";
import { TCreateOrderSchema } from "../schema/create";
import Stripe from "stripe";
import { ResponseService } from "@/services";
import { OrderModel } from "../model/order";
import { OrderStatusEnum } from "../schema/main";
import cloudinary from "@/helper/cloudinary";
import {
    AddToOrderImageUploadQueue,
    TOrderImageUplaodQueuePayload,
} from "@/queue/orderImageUpload.queue";
import { AddToDeleteOrderQueue } from "@/queue/deleteOrderQueue";
import UserDto from "@/modules/auth/dto/user.dto";
import { v4 as uuidV4 } from "uuid";
import mongoose from "mongoose";
import { OrderTopingModel } from "../model/orderTopings";
import {
    AddToOrderTopingImageUploadQueue,
    TOrderTopingImageUplaodQueuePayload,
} from "@/queue/orderTopingImageUpload.queue";

type TLineItem = {
    price_data: {
        currency: string;
        product_data: {
            name: string;
            images: string[];
        };
        unit_amount: number;
    };
    quantity: number;
}[];

const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

class OrderCreate {
    static async create(
        req: Request<{}, {}, TCreateOrderSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { products } = req.body;
        const user = req.user as UserDto;

        const lineItems: TLineItem = products.map((pro) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: pro.name,
                    images: [cloudinary.url(pro.image)],
                },
                unit_amount: pro.price * 100,
            },
            quantity: pro.quantity,
        }));

        const jobId = uuidV4();
        // these are for image upload queue
        const imageArrayWithOrderIds: TOrderImageUplaodQueuePayload = [];
        const imageArrayWithTopingIds: TOrderTopingImageUplaodQueuePayload = [];

        // these are for delete order queue
        const orderIds: string[] = [];
        const orderTopingIds: string[] = [];

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const topings = await OrderTopingModel.insertMany(
                products.map((pro) => {
                    const obj: any = {};
                    pro.topings.forEach((toping) => {
                        obj.name = toping.name;
                        obj.image =
                            process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL;
                        obj.price = toping.price;
                    });
                    return obj;
                }),
                {
                    session,
                },
            );

            const orders = await OrderModel.insertMany(
                products.map((pro) => {
                    const topingIds: string[] = [];
                    topings.forEach((top, index) => {
                        topingIds.push(top._id.toString());
                        imageArrayWithTopingIds.push({
                            orderTopingId: top._id.toString(),
                            image: pro.topings[index].image,
                        });
                    });

                    return {
                        user_full_name: `${user.first_name} ${
                            user.last_name || ""
                        }`,
                        name: pro.name,
                        image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
                        price: pro.price,
                        description: pro.description,
                        quantity: pro.quantity,
                        status: OrderStatusEnum.PLACED,
                        address: "lskd",
                        order_topings: topingIds,
                    };
                }),
                {
                    session,
                },
            );

            orders.forEach((order, index) => {
                imageArrayWithOrderIds.push({
                    orderId: order._id,
                    image: products[index].image,
                });
                orderIds.push(order._id);
                orderTopingIds.concat(order.order_topings.toString());
            });

            const stripeSessoin = await stripe.checkout.sessions.create({
                customer_email: user.email,
                payment_method_types: ["card"],
                shipping_address_collection: {
                    allowed_countries: ["IN"],
                },
                line_items: lineItems as any,
                mode: "payment",
                success_url: process.env.FRONTEND_URL,
                cancel_url: process.env.FRONTEND_URL,
                metadata: {
                    orderIds: JSON.stringify(orderIds),
                    userId: user.id,
                    queueJobId: jobId,
                },
                shipping_options: [
                    {
                        shipping_rate_data: {
                            type: "fixed_amount",
                            fixed_amount: {
                                amount: 1000,
                                currency: "inr",
                            },
                            display_name: "Next day air",
                            delivery_estimate: {
                                minimum: {
                                    unit: "business_day",
                                    value: 1,
                                },
                                maximum: {
                                    unit: "business_day",
                                    value: 1,
                                },
                            },
                        },
                    },
                ],
            });

            ResponseService.sendResponse(res, 200, true, stripeSessoin.id);
            await Promise.all([
                AddToOrderImageUploadQueue(imageArrayWithOrderIds),
                AddToOrderTopingImageUploadQueue(imageArrayWithTopingIds),
                AddToDeleteOrderQueue({
                    orderIds: orderIds,
                    sessionId: stripeSessoin.id,
                    orderTopingsIds: orderTopingIds,
                    jobId,
                }),
            ]);
        });
        await session.endSession();
    }
}
export default OrderCreate;

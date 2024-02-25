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
            images: string[]; // Array of image URLs
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

        const lineItems: TLineItem = [];
        products.forEach((pro) => {
            lineItems.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: pro.name,
                        images: [cloudinary.url(pro.image)],
                    },
                    unit_amount: pro.price * 100,
                },
                quantity: pro.quantity,
            });
        });

        const jobId = uuidV4();
        const imageArrayWithOrderIds: TOrderImageUplaodQueuePayload = [];
        const imageArrayWithTopingIds: TOrderTopingImageUplaodQueuePayload = [];
        const orderIds = [];
        const orderTopingIds: unknown[] = [];

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            let orders = await Promise.all(
                products.map(async (pro) => {
                    const topings = await OrderTopingModel.insertMany(
                        pro.topings.map((toping) => ({
                            name: toping.name,
                            image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
                            price: toping.price,
                        })),
                        { session },
                    );

                    const tids: string[] = [];

                    topings.forEach((top, index) => {
                        tids.push(top._id.toString());
                        imageArrayWithTopingIds.push({
                            orderTopingId: top._id.toString(),
                            image: pro.topings[index].image,
                        });
                    });

                    return OrderModel.create(
                        [
                            {
                                user_full_name: `${user.first_name} ${
                                    user.last_name || ""
                                }`,
                                name: pro.name,
                                city: "sd",
                                state: "slkd",
                                image: process.env
                                    .CLOUDINARY_PLACEHOLDER_IMAGE_URL,
                                price: pro.price,
                                description: pro.description,
                                quantity: pro.quantity,
                                status: OrderStatusEnum.PLACED,
                                address: "lskd",
                                order_topings: tids,
                            },
                        ],
                        { session },
                    );
                }),
            );

            for (let i = 0; i < products.length; i++) {
                imageArrayWithOrderIds.push({
                    orderId: orders[i][0]._id,
                    image: products[i].image,
                });
                orderIds.push(orders[i][0]._id);
                orders[i][0].order_topings.forEach((id) =>
                    orderTopingIds.push(id),
                );
            }

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
            await session.commitTransaction();

            await Promise.all([
                AddToOrderImageUploadQueue(imageArrayWithOrderIds),
                AddToOrderTopingImageUploadQueue(imageArrayWithTopingIds),
                AddToDeleteOrderQueue({
                    orderIds: orderIds,
                    sessionId: stripeSessoin.id,
                    orderTopingsIds: orderTopingIds as string[],
                    jobId,
                }),
            ]);
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            ResponseService.sendResponse(res, 400, false, {
                code: 400,
                message: "something went wrong",
            });
        } finally {
            await session.endSession();
        }
    }
}
export default OrderCreate;

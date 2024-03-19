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
import mongoose, {  Types } from "mongoose";
import { OrderTopingModel} from "../model/orderTopings";
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
                unit_amount: Math.round(pro.price * 100)
            },
            quantity: pro.quantity,
        }));

        const jobId = uuidV4();
        // these are for image upload queue
        const imageArrayWithOrderIds: TOrderImageUplaodQueuePayload = [];
        const imageArrayWithTopingIds: TOrderTopingImageUplaodQueuePayload = [];
        const topingIdsForOrder: Types.ObjectId[][] = [];
        const orderIds: string[] = [];
        const orderTopingIds: string[] = [];

        const topingsToInsert = products
            .map((pro) => {
                const topings = pro.topings.map((top) => {
                    const id = new Types.ObjectId();
                    imageArrayWithTopingIds.push({
                        orderTopingId: id.toString(),
                        image: top.image,
                    });
                    orderTopingIds.push(id.toString());
                    return {
                        _id: id,
                        name: top.name,
                        image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
                        price: top.price,
                    };
                });
                topingIdsForOrder.push(topings.map((top) => top._id));
                return topings;
            })
            .flat();

        const ordersToInsert = products.map((pro, index) => {
            const id = new Types.ObjectId();
            imageArrayWithOrderIds.push({
                image: pro.image,
                orderId: id.toString(),
            });
            orderIds.push(id.toString());
            return {
                _id: id,
                name: pro.name,
                image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
                price: pro.price,
                description: pro.description,
                quantity: pro.quantity,
                status: OrderStatusEnum.PLACED,
                address: "lskd",
                order_topings: topingIdsForOrder[index],
            };
        });

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {

            const result = await Promise.all([
                stripe.checkout.sessions.create({
                    customer_email: user.email,
                    payment_method_types: ["card"],
                    shipping_address_collection: {
                        allowed_countries: ["IN"],
                    },
                    line_items: lineItems as any,
                    mode: "payment",
                    success_url: process.env.PAYMENT_SCCESS_URL,
                    cancel_url: process.env.PAYMENT_FAILED_URL,
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
                }),
                OrderTopingModel.insertMany(topingsToInsert, {
                    session,
                }),
                OrderModel.insertMany(ordersToInsert, {
                    session,
                }),
            ]);
            const [stripeSessoin] = result;

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

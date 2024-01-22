import { NextFunction, Request, Response } from "express";
import { TCreateOrderSchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import { OrderStatusEnum, TOrderObject, TOrderTopingSchema } from "../schema/main";
import { ResponseService } from "@/services";
import { TopingModel } from "@/modules/topings/topings.model";
import { ProductModel } from "@/modules/products/models/product.model";
import { ProductPriceSectionModel } from "@/modules/products/models/productPriceSection.model.ts";
import { TOrderProductSections } from "../model/orderDetails";
import { v4 as uuidV4 } from "uuid";
import Stripe from "stripe";
import RedisClient from "@/redis";
import { UserModel } from "@/modules/auth/models/user.model";

const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

class OrderCreate {
    static async create(
        req: Request<{}, {}, TCreateOrderSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { topings, product_id, product_sections, product_price, quantity,user_id ,address} =
            req.body;
        let original_price = 0;
        const product = await ProductModel.findOne({ _id: product_id });
        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }
        const user = await UserModel.findOne({ _id: user_id });
        if (!user) {
            return next(new ErrorResponse("User does not exist", 404));
        }
        // TODO: still left to handle edge cases when there is not  product price sections provided by frontend or it doesn't even exist
        // if sections does not exist we have to consider product_price as order price
        const modifiedProductSections: TOrderProductSections = [];

        if (product_sections) {
            const fetchedProductSections = await ProductPriceSectionModel.find({
                product_id: product_id,
            });

            for (let i = 0; i < product_sections.length; i++) {
                const sections = fetchedProductSections.find(
                    (item) => item.name == product_sections[i].name,
                );
                sections?.attributes.forEach((att) => {
                    if (att.id == product_sections[i].attribute) {
                        modifiedProductSections.push({
                            name: product_sections[i].name,
                            attribute: att.name,
                            value: att.value,
                        });
                        original_price += att.value;
                    }
                });
            }
        }

        const fetchedTopings = await TopingModel.find({
            _id: { $in: topings },
        });

        if (fetchedTopings.length < topings.length) {
            return next(new ErrorResponse("Invalid topings", 422));
        }

        fetchedTopings.forEach((toping) => {
            original_price += toping.price;
        });
        // if (original_price !== price) {
        //     return next(new ErrorResponse("Invalid price provided", 422));
        // }
        const TopingArray: TOrderTopingSchema["topings"] = [];

        for (let toping of fetchedTopings) {
            TopingArray.push({
                name: toping.name,
                price: toping.price,
                image: `${process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL}`,
            });
        }

        const orderObject:TOrderObject = {
            order: {
                price:original_price,
                status: OrderStatusEnum.PLACED, // TODO: later fix when implementing stripe
                user_full_name: `${user.first_name} ${user.last_name}`,
                product_name: product.name,
                image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL || "",
                address:address,
                quantity: quantity,
            },
            order_detail: {
                product_name: product.name,
                toping: TopingArray,
                product_sections: modifiedProductSections,
            },
        };
        const key = `order_id:${uuidV4()}`;
        await RedisClient.set(key, JSON.stringify(orderObject));
        await RedisClient.expire(key, 300); // expire in 5 minutes
        const paymentIntent = await stripe.paymentIntents.create({
            currency: "inr",
            amount: original_price * 100,
            payment_method_types: ["card"],
            metadata: {
                order_redis_key: key,
            },
        });

        ResponseService.sendResponse(res, 200, true, {
            client_secret: paymentIntent.client_secret,
        });
    }
}
export default OrderCreate;

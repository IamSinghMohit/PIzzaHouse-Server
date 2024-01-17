import { NextFunction, Request, Response } from "express";
import { TCreateOrderSchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import { OrderStatusEnum, TOrderTopingSchema } from "../schema/main";
import { ImageService, ResponseService } from "@/services";
import { TopingModel } from "@/modules/topings/topings.model";
import { ProductModel } from "@/modules/products/models/product.model";
import { ProductPriceSectionModel } from "@/modules/products/models/productPriceSection.model.ts";
import {
    OrderDetailsModel,
    TOrderProductSections,
} from "../model/orderDetails";
import mongoose from "mongoose";
import { OrderModel } from "../model/order";

import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

class OrderCreate {
    static async create(
        req: Request<{}, {}, TCreateOrderSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { topings, product_id, product_sections, price } = req.body;
        let original_price = 0;

        const product = await ProductModel.findOne({ _id: product_id });
        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
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
                            attribute_name: att.name,
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
        if (original_price !== price) {
            return next(new ErrorResponse("Invalid price provided", 422));
        }
        const CoudinaryOrderFolderName = `${process.env.CLOUDINARY_ORDER_FOLDER}`;
        const TopingArray: TOrderTopingSchema["topings"] = [];

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            for (let toping of fetchedTopings) {
                const result = await ImageService.uploadWithUrl(
                    toping.image,
                    CoudinaryOrderFolderName,
                );
                TopingArray.push({
                    name: toping.name,
                    price: toping.price,
                    image: result.url,
                });
            }

            const productImage = await ImageService.uploadWithUrl(
                product.image,
                CoudinaryOrderFolderName,
            );
            await OrderDetailsModel.create(
                [
                    {
                        product_name: product.name,
                        toping: TopingArray,
                        product_sections: modifiedProductSections,
                    },
                ],
                { session },
            );
            const order = await OrderModel.create(
                [
                    {
                        price,
                        status: OrderStatusEnum.CONFIRMED, // TODO: later fix when implementing stripe
                        product_name: product.name,
                        image: productImage,
                        quantity:1
                    },
                ],
                { session },
            );
            // TODO: fix this for many products at once
            //  because it will only work if there is only one product
            //
            session.commitTransaction();
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "inr",
                amount: original_price * 100,
                payment_method_types: ["card"],
            });

            ResponseService.sendResponse(res, 200, true, {
                client_secret: paymentIntent.client_secret,
                order_id: order[0]._id,
            });
        } catch (error) {
            session.abortTransaction();
            Promise.all(
                TopingArray.map(async (toping) => {
                    await ImageService.deleteImage(toping.image);
                }),
            );
            next(new ErrorResponse("Failed create order", 500));
        } finally {
            session.endSession();
        }
    }
}
export default OrderCreate;

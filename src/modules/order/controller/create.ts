import { NextFunction, Request, Response } from "express";
import { TCreateOrderSchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import {
    OrderStatusEnum,
    TOrderTopingSchema,
} from "../schema/main";
import { ResponseService } from "@/services";
import { TopingModel } from "@/modules/topings/topings.model";
import { ProductModel } from "@/modules/products/models/product.model";
import { ProductPriceSectionModel } from "@/modules/products/models/productPriceSection.model.ts";
import { TOrderProductSections } from "../model/orderDetails";
import Stripe from "stripe";
import { TUser } from "@/modules/auth/models/user.model";

const stripe = new Stripe(`${process.env.STRIPE_SECRETKEY}`);

class OrderCreate {
    static async create(
        req: Request<{}, {}, TCreateOrderSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const {
            topings,
            product_id,
            product_sections,
            quantity,
            address,
            city,
            state,
        } = req.body;

        let originalPrice = 0;
        const user = req.user as TUser;

        const product = await ProductModel.findOne({ _id: product_id });
        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }

        const modifiedProductSections: TOrderProductSections = [];

        if (product.sections.length > 0) {
            const fetchedProductSections = await ProductPriceSectionModel.find({
                _id: { $in: product.sections },
            });

            product_sections.forEach((sec) => {
                const section = fetchedProductSections.find(
                    (item) => item.name == sec.name,
                );
                console.log(section);
                section?.attributes.forEach((att) => {
                    if (att.name === sec.attribute) {
                        modifiedProductSections.push({
                            name: sec.name,
                            attribute: att.name,
                            value: att.value,
                        });
                        originalPrice += att.value;
                    }
                });
            });
        }

        const TopingArray: TOrderTopingSchema["topings"] = [];
        if (topings.length > 0) {
            const fetchedTopings = await TopingModel.find({
                _id: { $in: topings },
            });

            if (fetchedTopings.length < topings.length) {
                return next(new ErrorResponse("invalid topings", 422));
            }

            fetchedTopings.forEach((toping) => {
                originalPrice += toping.price;

                TopingArray.push({
                    name: toping.name,
                    price: toping.price,
                    image: toping.image,
                });
            });
        }


        const paymentIntent = await stripe.paymentIntents.create({
            currency: "inr",
            amount: originalPrice * 100,
            payment_method_types: ["card"],
            metadata: {
                price: originalPrice,
                status: OrderStatusEnum.PLACED,
                user_full_name:`${user.first_name} ${user.last_name}`,
                user_id:user._id,
                image: product.image,
                address: address,
                quantity: quantity,
                city: city,
                state: state,
                product_name: product.name,
                toping: JSON.stringify(TopingArray),
                product_sections: JSON.stringify(modifiedProductSections),
            },
        });

        ResponseService.sendResponse(res, 200, true, {
            client_secret: paymentIntent.client_secret,
            total_price: originalPrice * quantity,
        });
    }
}
export default OrderCreate;

import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import { Product, ProductModel } from "../models/product.model";
import { ProductDefaultPriceAttributModel } from "../models/productDefaultAttribute.model";
import { CategoryModel } from "@/modules/category/models/category.model";
import { TUpdateProductSchema } from "../schema/update";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";
import RedisClient from "@/redis";
import { AddToProductImageUploadQueue } from "@/queue/productImageUPload.queue";
import mongoose from "mongoose";
import { warn } from "console";

class ProductUpdate {
    static async update(
        req: Request<{ id: string }, {}, Partial<TUpdateProductSchema>>,
        res: Response,
        next: NextFunction,
    ) {
        const {
            name,
            price,
            status,
            featured,
            id,
            default_attributes,
            description,
        } = req.body;
        console.log(req.body);
        const product = await ProductModel.findOne({ _id: id });
        if (!product) {
            return next(new ErrorResponse("Product does not exist", 404));
        }
        if (name) product.name = name;
        if (status) product.status = status;
        if (description) product.description = description;
        if(price) product.price = price;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if (default_attributes) {
                await ProductDefaultPriceAttributModel.deleteOne({
                    _id: product.default_attribute,
                },{session});
                const pda = await ProductDefaultPriceAttributModel.create(
                    [
                        {
                            product_id: product._id,
                            category: product.category,
                            attributes: default_attributes,
                        },
                    ],
                    { session },
                );
                product.default_attribute = pda[0]._id;
            }

            if (req.file?.buffer) {
                product.image = process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL!;
            }

            product.featured = featured || false;
            await product.save({session});
            await session.commitTransaction();
            ResponseService.sendResponse(
                res,
                200,
                true,
                "product updated successfully",
            );
            if (!req.file?.buffer) return;

            const category = await CategoryModel.findOne({
                name: product.category,
            });

            await AddToDeleteImageQueue({
                tag: `productId:${product._id}`,
            });
            const key = `productId:${product._id}:buffer`;
            await RedisClient.set(key, req.file.buffer);
            await AddToProductImageUploadQueue({
                productBufferRedisKey: key,
                categoryId: category?._id!,
                productId: product._id,
            });
        } catch (error) {
            await session.abortTransaction();
            next(error);
        } finally {
            await session.endSession();
        }
    }
}
export default ProductUpdate;

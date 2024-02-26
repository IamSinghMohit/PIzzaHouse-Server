import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import { ProductModel } from "../models/product.model";
import { ProductDefaultPriceAttributModel } from "../models/productDefaultAttribute.model";
import { CategoryModel } from "@/modules/category/models/category.model";
import { TUpdateProductSchema } from "../schema/update";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";
import RedisClient from "@/redis";
import { AddToProductImageUploadQueue } from "@/queue/productImageUPload.queue";
import mongoose from "mongoose";
import { TRedisBufferKey } from "@/queue/types";
import { ProductPriceSectionModel } from "../models/productPriceSection.model.ts";

class ProductUpdate {
    static async update(
        req: Request<{}, {}, Partial<TUpdateProductSchema>>,
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
            sections,
        } = req.body;
        console.log(req.body);
        const product = await ProductModel.findOne({ _id: id });
        if (!product) {
            return next(new ErrorResponse("product not found", 404));
        }
        const category = await CategoryModel.findOne({
            name: product.category,
        });
        if (!category) {
            return next(new ErrorResponse("category not found", 404));
        }
        if (name) product.name = name;
        if (status) product.status = status;
        if (description) product.description = description;
        if (price) product.price = price;

        product.featured = featured || false;

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            if (default_attributes) {
                const result = await Promise.all([
                    ProductDefaultPriceAttributModel.create(
                        [
                            {
                                product_id: product._id,
                                category: product.category,
                                attributes: default_attributes,
                            },
                        ],
                        { session },
                    ),
                    ProductDefaultPriceAttributModel.deleteOne(
                        {
                            _id: product.default_attribute,
                        },
                        { session },
                    ),
                ]);

                product.default_attribute = result[0][0]._id;
            }

            if (sections) {
                const arr: any = [];
                const sectionsToInsert = sections.map((sec) => ({
                    category: category?.name,
                    name: sec.name,
                    attributes: sec.attributes,
                }));

                const result = await Promise.all([
                    ProductPriceSectionModel.insertMany(sectionsToInsert),
                    ProductPriceSectionModel.deleteMany(
                        { _id: { $in: product.sections } },
                        { session },
                    ),
                ]);
                product.sections = result[0].map((sec) => sec._id);
            }

            if (req.file?.buffer) {
                product.image = process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL!;
            }

            await product.save({ session });
            ResponseService.sendResponse(
                res,
                200,
                true,
                "product updated successfully",
            );
            if (!req.file?.buffer) return;

            const key: TRedisBufferKey = `productId:${product._id}:buffer`;
            await Promise.all([
                AddToDeleteImageQueue({
                    tag: `productId:${product._id}`,
                }),
                RedisClient.set(key, req.file.buffer),
                AddToProductImageUploadQueue({
                    productBufferRedisKey: key,
                    categoryId: category._id,
                    productId: product._id,
                }),
            ]);

        });
       await session.endSession() 

    }
}
export default ProductUpdate;

import { Request, Response, NextFunction } from "express";
import { TCreateProductSchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import AdminProductDto from "../dto/product/admin";
import { ProductPriceSectionModel } from "../models/productPriceSection.model.ts";
import { ProductDefaultPriceAttributModel } from "../models/productDefaultAttribute.model";
import { ProductModel } from "../models/product.model";
import mongoose from "mongoose";
import { CategoryModel } from "@/modules/category/models/category.model";
import { ResponseService } from "@/services";
import { AddToProductImageUploadQueue } from "@/queue/productImageUPload.queue";
import RedisClient from "@/lib/redis";
import { TRedisBufferKey } from "@/queue/types";

class ProductCreate {
    static async createProduct(
        req: Request<{}, {}, TCreateProductSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const {
            name,
            sections,
            category_id,
            description,
            status,
            featured,
            default_attributes,
            price,
        } = req.body;

        if (!req.file || !req.file.buffer){
            return next(new ErrorResponse("image is required", 422));
        }

        // checking if product already exist
        const isExist = await ProductModel.findOne({ name });
        if (isExist) {
            return next(new ErrorResponse("product already exist", 403));
        }

        // checking if provide category is valid
        const category = await CategoryModel.findOne({ _id: category_id });
        if (!category) {
            return next(new ErrorResponse("category not  found", 404));
        }

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const product = new ProductModel({
                image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
                category: category.name,
                name,
                featured,
                price,
                description,
                status,
            });

            const sectionsToinsert = sections.map(({ name, attributes }) => ({
                category: category.name,
                name,
                attributes: attributes,
            }));

            const insertedSections = await ProductPriceSectionModel.insertMany(
                sectionsToinsert,
                { session },
            );

            product.sections = insertedSections.map((sec) => sec._id);

            product.default_attribute =
                await ProductDefaultPriceAttributModel.create(
                    [
                        {
                            product_id: product._id.toString(),
                            category: category.name,
                            attributes: default_attributes,
                        },
                    ],
                    { session },
                ).then((res) => res[0]._id);

            const ProductResult = await product.save({ session });
            await session.commitTransaction();

            const key: TRedisBufferKey = `productId:${product._id}:buffer`;

            await Promise.all([
                RedisClient.set(key, req.file!.buffer),
                AddToProductImageUploadQueue({
                    productId: product._id,
                    categoryId: category._id,
                    productBufferRedisKey: key,
                }),
            ]);

            ResponseService.sendResponse(
                res,
                202,
                true,
                new AdminProductDto(ProductResult),
            );
        });

        await session.endSession()
    }
}
export default ProductCreate;

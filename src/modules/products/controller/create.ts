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
import RedisClient from "@/redis";

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

        if (!req.file) return next(new ErrorResponse("image is required", 422));
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
        session.startTransaction();
        try {
            const product = new ProductModel({
                image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
                category: category.name,
                name,
                featured,
                price,
                description,
                status,
            });
            const ProductSectionIdArray: string[] = [];
            // creating product price sections
            await Promise.all(
                sections.map(async ({ name, attributes }) => {
                    const patt = new ProductPriceSectionModel({
                        product_id: product._id.toString(),
                        category: category.name,
                        name,
                        attributes: attributes,
                    });
                    ProductSectionIdArray.push(patt._id.toString());
                    await patt.save({ session });
                }),
            );

            // creating product_default_price document
            const productDeafultAttribute =
                await ProductDefaultPriceAttributModel.create(
                    [
                        {
                            product_id: product._id.toString(),
                            category: category.name,
                            attributes: default_attributes,
                        },
                    ],
                    { session },
                );

            // savving the product with other releated fields
            product.sections = ProductSectionIdArray;
            product.default_attribute = productDeafultAttribute[0]._id;

            const ProductResult = await product.save();
            await session.commitTransaction();

            ResponseService.sendResponse(
                res,
                202,
                true,
                new AdminProductDto(ProductResult),
            );
            const redisKey = `productId:${product._id}:buffer`;
            await RedisClient.set(redisKey, req.file.buffer);
            await AddToProductImageUploadQueue({
                productId: product._id,
                categoryId: category._id,
                productBufferRedisKey: redisKey,
            });
        } catch (error) {
            await session.abortTransaction();
            next(new ErrorResponse("Error while creating product", 500));
        } finally {
            await session.endSession();
        }
    }
}
export default ProductCreate;

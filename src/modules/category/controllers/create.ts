import { NextFunction, Request, Response } from "express";
import { TCreateCategorySchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import AdminCategoryDto from "../dto/category/admin";
import { AddToCategoryImageUploadQueue } from "@/queue/categoryImageUpload.queue";
import { CategoryModel } from "../models/category.model";
import mongoose from "mongoose";
import RedisClient from "@/redis";
import { CategoryPriceSectionModel } from "../models/categoryPriceSection";
import { TRedisBufferKey } from "@/queue/types";

class CategoryCreate {
    static async createCategory(
        req: Request<{}, {}, TCreateCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { name, sections } = req.body;

        if (!req.file || !req.file.buffer) {
            return next(new ErrorResponse("image is required", 422));
        }

        const isExist = await CategoryModel.findOne({
            name: { $regex: new RegExp(name, "i") },
        });

        if (isExist) {
            return next(new ErrorResponse("Category already exist", 403));
        }

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {

            const category = new CategoryModel({
                name,
                image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
            });

            const sectionsToInsert = sections.map(({ name, attributes }) => ({
                category_id: category.id,
                name,
                attributes: attributes,
            }));
            const insertedSections =
                await CategoryPriceSectionModel.insertMany(sectionsToInsert,{session});

            category.sections = insertedSections.map((sec) => sec._id);
            const CatResult = await category.save({ session });

            const key: TRedisBufferKey = `categoryId:${category._id}:buffer`;

            await Promise.all([
                RedisClient.set(key, req.file!.buffer),
                AddToCategoryImageUploadQueue({
                    categoryBufferRedisKey: key,
                    categoryId: category._id,
                }),
            ]);

            ResponseService.sendResponse(
                res,
                202,
                true,
                new AdminCategoryDto(CatResult),
            );
        });

        await session.endSession()
    }
}
export default CategoryCreate;

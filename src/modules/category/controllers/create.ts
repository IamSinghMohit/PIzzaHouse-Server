import { NextFunction, Request, Response } from "express";
import { TCreateCategorySchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import AdminCategoryDto from "../dto/category/admin";
import {
    AddToCategoryImageUploadQueue,
    CategoryImageUploadQueue,
} from "@/queue/categoryImageUpload.queue";
import { QueueEnum } from "@/queue/types/enum";
import { CategoryModel } from "../models/category.model";
import mongoose from "mongoose";
import RedisClient from "@/redis";
import { CategoryPriceSectionModel } from "../models/categoryPriceSection";

class CategoryCreate {
    static async createCategory(
        req: Request<{}, {}, TCreateCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { name, sections } = req.body;

        const isExist = await CategoryModel.findOne({
            name: { $regex: new RegExp(name, "i") },
        });

        if (isExist) {
            return next(new ErrorResponse("Category already exist", 403));
        }
        if (!req.file?.buffer) {
            return next(new ErrorResponse("Image required", 403));
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const category = new CategoryModel({
                name,
                image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL,
            });
            const SectionIdArray: string[] = [];
            await Promise.all(
                sections.map(({ name, attributes }) => {
                    const section = new CategoryPriceSectionModel({
                        category_id: category.id,
                        name,
                        attributes: attributes,
                    });

                    SectionIdArray.push(section._id);
                    section.save({ session });
                }),
            );
            category.sections = SectionIdArray;

            const CatResult = await category.save({ session });
            await session.commitTransaction();

            ResponseService.sendResponse(
                res,
                202,
                true,
                new AdminCategoryDto(CatResult),
            );

            const key = `categoryId:${category._id}:buffer`;
            await RedisClient.set(key, req.file.buffer);
            await AddToCategoryImageUploadQueue({
                categoryBufferRedisKey: key,
                categoryId: category._id,
            });
        } catch (error) {
            next(error);
            await session.abortTransaction();
        } finally {
            await session.endSession();
        }
    }
}
export default CategoryCreate;

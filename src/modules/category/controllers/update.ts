import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "@/utils";
import { CategoryModel } from "../models/category.model";
import RedisClient from "@/redis";
import { ResponseService } from "@/services";
import { TUpdateCategorySchema } from "../schema/update";
import { AddToCategoryImageUploadQueue } from "@/queue/categoryImageUpload.queue";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";
import { TRedisBufferKey } from "@/queue/types";

class CategoryUpdate {
    static async category(
        req: Request<{}, {}, TUpdateCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const category = await CategoryModel.findOne({ _id: req.body.id });
        if (!category) {
            return next(new ErrorResponse("Category not found", 404));
        }
        if (!req.file?.buffer) {
            return next(new ErrorResponse("Image required", 400));
        }

        category.image = process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL!;
        await category.save();
        ResponseService.sendResponse(res, 200, true, "image updated");

        await AddToDeleteImageQueue({ tag: `categoryId:${category._id}` });
        const key:TRedisBufferKey = `categoryId:${category._id}:buffer`;
        await RedisClient.set(key, req.file.buffer);
        await AddToCategoryImageUploadQueue({
            categoryBufferRedisKey: key,
            categoryId: category._id,
        });
    }
}
export default CategoryUpdate;

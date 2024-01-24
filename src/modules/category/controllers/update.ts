import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "@/utils";
import { CategoryModel } from "../models/category.model";
import RedisClient from "@/redis";
import { CategoryImageUploadQueue, TImageUploadQueue } from "@/queue/categoryImageUpload.queue";
import { ResponseService } from "@/services";
import { TUpdateCategorySchema } from "../schema/update";
import { DeleteImaeQueue } from "@/queue/deleteImage.queue";

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

        const categoryBufferRedisKey = `category_image_update:${category._id}`;
        await RedisClient.set(categoryBufferRedisKey, req.file.buffer);
        await CategoryImageUploadQueue.add(`image update ${category._id}`, {
            categoryBufferRedisKey,
            categoryId:category._id
        } as TImageUploadQueue);

        await DeleteImaeQueue.add(`delete category image`,{

        })
        category.image = process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL!;
        await category.save();
        ResponseService.sendResponse(res, 200, true, "Image updated");
        console.log('controller ended')
    }
}
export default CategoryUpdate;

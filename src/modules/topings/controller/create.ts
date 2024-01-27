import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import AdminTopingDto from "../dto/admin";
import { TCreateTopingSchema } from "../schema/create";
import { TopingModel } from "../topings.model";
import { CategoryModel } from "@/modules/category/models/category.model";
import { TRedisBufferKey } from "@/queue/types";
import RedisClient from "@/redis";
import { AddToTopingImageUploadQueue } from "@/queue/topingImageUpload.queue";

class TopingsCreate {
    static async toping(
        req: Request<{}, {}, TCreateTopingSchema>,
        res: Response,
        next: NextFunction,
    ) {
        if (!req.file?.buffer) {
            return next(new ErrorResponse("Image is required", 402));
        }
        const { name, category_id, price, status } = req.body;
        const isExist = await TopingModel.findOne({ name });

        if (isExist) {
            return next(new ErrorResponse("product already exist", 403));
        }
        const category = await CategoryModel.findOne({ _id: category_id });

        if (!category) {
            return next(new ErrorResponse("category not found", 404));
        }

        const toping = await TopingService.create({
            name,
            category: category.name,
            status,
            price,
            image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL!,
        });

        ResponseService.sendResponse(
            res,
            202,
            true,
            new AdminTopingDto(toping),
        );
        const key:TRedisBufferKey = `topingId:${toping._id}:buffer`
        await RedisClient.set(key,req.file.buffer)
        await AddToTopingImageUploadQueue({
            topingBufferRedisKey:key,
            topingId:toping._id,
            categoryId:category._id
        })
    }
}
export default TopingsCreate;

import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import AdminTopingDto from "../dto/admin";
import { TCreateTopingSchema } from "../schema/create";
import { TopingModel } from "../topings.model";
import { TRedisBufferKey } from "@/queue/types";
import RedisClient from "@/lib/redis";
import { AddToTopingImageUploadQueue } from "@/queue/topingImageUpload.queue";
import { CategoryModel } from "@/modules/category/models/category.model";

class TopingsCreate {
    static async toping(
        req: Request<{}, {}, TCreateTopingSchema>,
        res: Response,
        next: NextFunction,
    ) {
        if (!req.file?.buffer) {
            return next(new ErrorResponse("Image is required", 422));
        }
        const { name, categories, price, status } = req.body;
        const isExist = await TopingModel.findOne({ name });

        if (isExist) {
            return next(new ErrorResponse("toping already exist", 403));
        }
        const fetchedCategories = await CategoryModel.find({
            name: { $in: categories },
        }).select("name");

        if (fetchedCategories.length !== categories.length) {
            return next(new ErrorResponse("invalid categories", 422));
        }

        const toping = await TopingService.create({
            name,
            categories,
            status,
            price,
            image: process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL!,
        });

        const key: TRedisBufferKey = `topingId:${toping._id}:buffer`;

        await Promise.all([
            RedisClient.set(key, req.file.buffer),
            AddToTopingImageUploadQueue({
                topingBufferRedisKey: key,
                topingId: toping._id,
            }),
        ]);

        ResponseService.sendResponse(
            res,
            202,
            true,
            new AdminTopingDto(toping),
        );

    }
}
export default TopingsCreate;

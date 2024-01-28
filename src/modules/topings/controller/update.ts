import { NextFunction, Request, Response } from "express";
import { TUpdateTopingSchema } from "../schema/update";
import { TopingModel } from "../topings.model";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import AdminTopingDto from "../dto/admin";
import { TRedisBufferKey } from "@/queue/types";
import RedisClient from "@/redis";
import { AddToTopingImageUploadQueue } from "@/queue/topingImageUpload.queue";
import { CategoryModel } from "@/modules/category/models/category.model";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";

class TopingUpdate {
    static async toping(
        req: Request<{}, {}, TUpdateTopingSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { id, name, price, status } = req.body;
        const toping = await TopingModel.findOne({ _id: id });
        if (!toping) {
            return next(new ErrorResponse("toping not found", 404));
        }

        const category = await CategoryModel.findOne({
            name: toping.category,
        });
        if (!category) {
            return next(new ErrorResponse("category not found", 404));
        }

        if (name) toping.name = name;
        if (price) toping.price = price;
        if (status) toping.status = status;

        if (req.file?.buffer) {
            toping.image = process.env.CLOUDINARY_PLACEHOLDER_IMAGE_URL!;
        }
        await toping.save();
        ResponseService.sendResponse(
            res,
            200,
            true,
            new AdminTopingDto(toping),
        );

        if (!req.file?.buffer) return;

        await AddToDeleteImageQueue({
            tag: `topingId:${toping._id}`,
        });
        const key: TRedisBufferKey = `topingId:${toping._id}:buffer`;
        await RedisClient.set(key, req.file.buffer);
        await AddToTopingImageUploadQueue({
            topingId: toping._id,
            categoryId: category._id,
            topingBufferRedisKey: key,
        });
    }
}
export default TopingUpdate;

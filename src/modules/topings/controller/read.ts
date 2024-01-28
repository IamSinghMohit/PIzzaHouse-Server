import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ResponseService } from "@/services";
import {
    TGetAllTopingsSchema,
    TGetTopingWithCategorySchema,
} from "../schema/read";
import AdminTopingDto from "../dto/admin";
import BaseTopingDto from "../dto/base";
import { TopingModel } from "../topings.model";

class TopingRead {
    static async AllToping(
        req: Request<{}, {}, {}, TGetAllTopingsSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { category, status, min, max, name, limit, page } = req.query;
        const originalLimit = limit || 10;
        const originalPage = page || 1;

        const query: Record<any, any> = {
            ...(name ? { name: { $regex: new RegExp(name, "i") } } : {}),
            ...(category ? { category } : {}),
            ...(status ? { status } : {}),
        };
        const totalDocuments = await TopingModel.estimatedDocumentCount();

        if (min && max) {
            query.price = { $gte: min, $lte: max };
        } else if (min) {
            query.price = { $gte: min };
        } else if (max) {
            query.price = { $lte: max };
        }
        const topings = await TopingModel.find(query)
            .skip((originalPage - 1) * originalLimit)
            .limit(originalLimit);

        ResponseService.sendResponse(res, 202, true, {
            topings: topings.map((product) => new AdminTopingDto(product)),
            pages: Math.ceil(totalDocuments / originalLimit),
            // page:originalPage
            page: 1,
        });
    }

    static async TopingWithCategory(
        req: Request<TGetTopingWithCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const topings = await TopingService.findToping(
            { category: req.params.category },
            "FIND",
        );
        ResponseService.sendResponse(
            res,
            200,
            true,
            topings?.map((toping) => new BaseTopingDto(toping)),
        );
    }

    static async stats(
        req: Request<TGetTopingWithCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const toping = await TopingModel.findOne().sort({ price: -1 }).limit(1);
        ResponseService.sendResponse(res, 200, true, {
            max_price: (toping?.price || 0) + 10,
        });
    }
}
export default TopingRead;

import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ResponseService } from "@/services";
import {
    TGetAllTopingsSchema,
    TGetTopingWithCategorySchema,
} from "../schema/read";
import AdminTopingDto from "../dto/admin";

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

        if (min && max) {
            query.price = { $gte: min, $lte: max };
        } else if (min) {
            query.price = { $gte: min };
        } else if (max) {
            query.price = { $lte: max };
        }

        const topings = await TopingService.findPaginatedTopings(query, {
            limit: originalLimit,
            skip: (originalPage - 1) * originalLimit,
        });

        ResponseService.sendResponse(res, 202, true, {
            topings: topings.map((product) => new AdminTopingDto(product)),
            pages: Math.ceil(1 / originalLimit),
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
        ResponseService.sendResponse(res, 200, true, topings);
    }

    static async stats(
        req: Request<TGetTopingWithCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const price = await TopingService.getMaxPrice();
        ResponseService.sendResponse(res, 200, true, {
            max_price: price,
        });
    }
}
export default TopingRead;

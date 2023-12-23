import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ResponseService } from "@/services";
import { TGetTopingWithCategorySchema } from "../schema/read";

class TopingRead {
    static async getAllToping(req: Request, res: Response, next: NextFunction) {
        const topings = await TopingService.findToping({}, "FIND");
        ResponseService.sendResponse(res, 200, true, topings);
    }
    static async getTopingWithCategory(
        req: Request<TGetTopingWithCategorySchema>,
        res: Response,
        next: NextFunction
    ) {
        const topings = await TopingService.findToping(
            { category: req.params.category },
            "FIND"
        );
        ResponseService.sendResponse(res, 200, true,topings);
    }
}
export default TopingRead;

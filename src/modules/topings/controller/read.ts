import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ResponseService } from "@/services";
import { TGetTopingWithCategorySchema } from "../schema/read";

class TopingRead {
    static async getAllToping(req: Request, res: Response, next: NextFunction) {
        const topings = await TopingService.findToping({}, "FIND");
        ResponseService.sendResWithData(res, 200, { data: topings });
    }
    static async getTopingWithCategory(
        req: Request<TGetTopingWithCategorySchema>,
        res: Response,
        next: NextFunction
    ) {
        const topings = await TopingService.findToping(
            { category: req.params.category},
            "FIND"
        );
        ResponseService.sendResWithData(res, 200, { data: topings });
    }
}
export default TopingRead;

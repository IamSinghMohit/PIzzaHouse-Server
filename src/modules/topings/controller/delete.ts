import { NextFunction, Request, Response } from "express";
import { TDeleteTopingSchema } from "../schema/delete";
import TopingService from "../topings.service";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";

class TopingDelete {
    static async toping(
        req: Request<TDeleteTopingSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const id = req.params.id;
        const isExist = await TopingService.findToping({ _id: id }, "FINDONE");
        if (!isExist) {
            next(new ErrorResponse("Toping not found", 404));
        }
        await TopingService.delete({ _id: id });
        ResponseService.sendResponse(
            res,
            200,
            true,
            "Toping deleted successfully",
        );
    }
}
export default TopingDelete;

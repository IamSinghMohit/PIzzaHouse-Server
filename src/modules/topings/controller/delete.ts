import { NextFunction, Request, Response } from "express";
import { TDeleteTopingSchema } from "../schema/delete";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";
import { TopingModel } from "../topings.model";

class TopingDelete {
    static async toping(
        req: Request<TDeleteTopingSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const id = req.params.id;
        const toping = await TopingModel.findOne({ _id: id });
        if (!toping ) {
            return next(new ErrorResponse("Toping not found", 404));
        }
        await TopingModel.deleteOne({_id:toping._id})
        ResponseService.sendResponse(
            res,
            200,
            true,
            "Toping deleted successfully",
        );
        await AddToDeleteImageQueue({
            tag:`topingId:${toping._id}`
        })
    }
}
export default TopingDelete;

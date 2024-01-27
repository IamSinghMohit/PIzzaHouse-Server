import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import AdminTopingDto from "../dto/admin";
import { TCreateTopingSchema } from "../schema/create";
import { TopingModel } from "../topings.model";

class TopingsCreate {
    static async toping(
        req: Request<{}, {}, TCreateTopingSchema>,
        res: Response,
        next: NextFunction,
    ) {
        if(!req.file?.buffer){
            return next(new ErrorResponse("Image is required",402))
        }
        const { name, category_id, price, status } = req.body;
        const isExist = await TopingModel.findOne({ name });

        if (isExist) {
            next(new ErrorResponse("product already exist", 403));
        }

        const toping = await TopingService.create({
            name,
            category,
            status,
            price,
            image: result.url,
        });
        

        ResponseService.sendResponse(
            res,
            202,
            true,
            new AdminTopingDto(toping),
        );
    }
}
export default TopingsCreate;


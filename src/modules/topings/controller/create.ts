import { Request, Response, NextFunction } from "express";
import TopingService from "../topings.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import { CreateTopingSchemaType } from "../schema/create";
import AdminTopingDto from "../dto/admin";

class TopingsCreate {
    static async toping(
        req: Request<{}, {}, CreateTopingSchemaType>,
        res: Response,
        next: NextFunction,
    ) {
        if(!req.file?.buffer){
            return next(new ErrorResponse("Image is required",402))
        }
        const { name, category, price, status } = req.body;
        const isExist = await TopingService.findToping({ name }, "FINDONE");

        if (isExist) {
            next(new ErrorResponse("product already exist", 403));
        }

        const processedImage = await ImageService.compressImageToBuffer(req.file.buffer);

        const result = await ImageService.uploadImageWithBuffer(
            `${process.env.CLOUDINARY_TOPING_FOLDER}`,
            processedImage,
        );
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


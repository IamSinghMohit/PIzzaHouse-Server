import { NextFunction, Request, Response } from "express";
import CategoryAttrService from "../service/categoryAttr.service";
import { ResponseService } from "@/services";
import { ErrorResponse } from "@/utils";

class CategoryAttrController {
    static async getAttributes(
        req: Request<{ id: string }, {}, {}>,
        res: Response,
        next: NextFunction
    ) {
        const priceAtt = await CategoryAttrService.getAttribute({
            categoryId: req.params.id,
        });
        ResponseService.sendResWithData(res, 202, priceAtt);
    }

    // static async updatePriceAttr(
    //     req: Request<{}, {}, PriceAttrCatIdSchemaType>,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     if (!req.body.attribute_title && !req.body.attributes) {
    //         return next(new ErrorResponse("Please provide valid data", 403));
    //     }

    //     const priceAtt = await PriceAttributeService.updateAttribute(
    //         { categoryId: req.body.categoryId },
    //         {
    //             $set: {
    //                 ...(req.body.attribute_title
    //                     ? { attribute_title: req.body.attribute_title }
    //                     : {}),
    //                 ...(req.body.attributes
    //                     ? { attributes: req.body.attributes }
    //                     : {}),
    //             },
    //         }
    //     );

    //     ResponseService.sendResWithData(res, 202, priceAtt);
    // }
}
export default CategoryAttrController;

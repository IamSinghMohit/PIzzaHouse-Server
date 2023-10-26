import { categorySchema } from "./schema/category/create";
import { deleteCategorySchema } from "./schema/category/delete";
import { NextFunction, Request, Response } from "express";
import Validator from "@/utils/validatorWrapper.";
import { searchCategorySchema } from "./schema/category/read";

export class CategoryValidator {
    static async createCategory(req: Request, res: Response, next: NextFunction) {
        const obj = {
            name: req.body.name,
            price_attributes: [...JSON.parse(req.body.json)],
        };
        req.body = obj;
        await categorySchema.parseAsync(req.body);
        return next();
    }

    // static async deleteCategory(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     await deleteCategorySchema.parseAsync(req.params);
    //     return next();
    // }
    static deleteCategory = Validator.ReqParams(deleteCategorySchema)

    // static async searchCategory(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     await SearchCategoryParamSchema.parseAsync(req.params);
    // }

    static searchCategory = Validator.ReqQuery(searchCategorySchema)
}

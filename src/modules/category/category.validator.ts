import { CreateCategorySchema } from "./schema/create";
import { deleteCategorySchema } from "./schema/delete";
import { NextFunction, Request, Response } from "express";
import Validator from "@/utils/validatorWrapper.";
import { getAttributeSchem, getCategoriesSchema, searchCategorySchema } from "./schema/read";
import { UpdateCategorySchema } from "./schema/update";
import { ErrorResponse } from "@/utils";

export class CategoryValidator {
    static async createCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const obj = {
                name: req.body.name,
                price_attributes: [...JSON.parse(req.body.json)],
            };
            req.body = obj;
        } catch (error) {
            next(new ErrorResponse("Invalid input", 422));
        }
        try {
            await CreateCategorySchema.parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }

    static deleteCategory = Validator.ReqParams(deleteCategorySchema);

    static searchCategory = Validator.ReqQuery(searchCategorySchema);

    static getCategories = Validator.ReqQuery(getCategoriesSchema)

    static getAttributes = Validator.ReqParams(getAttributeSchem)

    static async updateCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const obj = {
                id: req.body.id,
                name: req.body.name,
                price_attributes: [...JSON.parse(req.body.json)],
                is_name_update: req.body.is_name_update == "true",
                is_image_update: req.body.is_image_update == "true",
                is_price_attributes_update:
                    req.body.is_price_attributes_update == "true",
            };
            req.body = obj;
        } catch (error) {
            next(new ErrorResponse("Invalid input", 422));
        }
        try {
            await UpdateCategorySchema.parseAsync(req.body);
            return next();
        } catch (error) {
            next(error);
        }
    }
}

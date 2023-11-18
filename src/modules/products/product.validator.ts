import { Request, Response, NextFunction } from "express";
import { CreateProductSchema } from "./schema/create";
import { ErrorResponse } from "@/utils";

class ProductValidator {
    static async createProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const obj = {
                name: req.body.name,
                categoryId: req.body.categoryId,
                description: req.body.description,
                status: req.body.status,
                price_attributes: JSON.parse(req.body.price_attributes_json),
            };
            req.body = obj;
        } catch (error) {
            next(new ErrorResponse("invalid input", 422));
        }
        try {
            await CreateProductSchema.parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
}
export default ProductValidator;

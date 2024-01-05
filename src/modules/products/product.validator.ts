import { CreateProductSchema } from "./schema/create";
import Validator from "@/utils/validatorWrapper.";
import {
    GetFormatedProductsSchema,
    GetProductPriceSectionSchema,
    GetProductSchema,
    GetProductsSchema,
} from "./schema/read";
import { DeleteProduct } from "./schema/delete";
import { ProductIdSchema } from "./schema/main";
import { NextFunction } from "express";
import { ErrorResponse } from "@/utils";

class ProductValidator {
    static createProduct = Validator.ReqBody(CreateProductSchema, (req) => {
        return {
            ...req.body,
            sections: JSON.parse(req.body.sections_json),
            default_attributes: JSON.parse(req.body.default_attributes_json),
            featured: req.body.featured === "true",
        };
    });
    static getProducts = Validator.ReqQuery(GetProductsSchema);

    static getProductPriceSections = Validator.ReqParams(
        GetProductPriceSectionSchema,
    );
    static deleteProduct = Validator.ReqParams(DeleteProduct);
    static getFromatedProducts = Validator.ReqQuery(
        GetFormatedProductsSchema,
        (req) => {
            return {
                productLimit: parseInt(req.query.productLimit) || 4,
                categoryLimit: parseInt(req.query.categoryLimit) || 4,
            };
        },
    );

    static updateProduct = (req: any, res: any, next: NextFunction) => {
        const id = ProductIdSchema.parse(req.params as any);
        if (!id) return next(new ErrorResponse("id is required", 422));
        try {
            if (req.body.sections_json) {
                req.body.sections = JSON.parse(req.body.sections_json);
            }
            if (req.body.default_attributes_json) {
                req.body.default_attributes = JSON.parse(
                    req.body.default_attributes_json,
                );
            }
            if (req.body.featured) {
                req.body.featured = req.body.featured === "true";
            }
        } catch (error) {
            return next(new ErrorResponse("Invalid input", 422));
        }
        try {
            req.body = CreateProductSchema.partial().parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };

    static getProduct = Validator.ReqParams(GetProductSchema);
}
export default ProductValidator;

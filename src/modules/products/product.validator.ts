import { CreateProductSchema } from "./schema/create";
import Validator from "@/utils/validatorWrapper.";
import {
    GetCursorPaginatedProducts,
    GetFormatedProductsSchema,
    GetMinimalInfoSchema,
    GetProductPriceSectionSchema,
    GetProductSchema,
    GetProductsSchema,
} from "./schema/read";
import { DeleteProduct } from "./schema/delete";
import { UpdateProductSchema } from "./schema/update";

class ProductValidator {
    static createProduct = Validator.ReqBody(CreateProductSchema, (req) => {
        return {
            ...req.body,
            sections: JSON.parse(req.body.sections_json),
            default_attributes: JSON.parse(req.body.default_attributes_json),
        };
    });
    static getProducts = Validator.ReqQuery(GetProductsSchema);

    static getProductPriceSections = Validator.ReqParams(
        GetProductPriceSectionSchema,
    );
    static deleteProduct = Validator.ReqParams(DeleteProduct);
    static updateProduct = Validator.ReqBody(UpdateProductSchema, (req) => {
        return {
            ...req.body,

            ...(req.body?.sections_json
                ? {
                      sections: JSON.parse(req.body.sections_json),
                  }
                : {}),

            ...(req.body?.default_attributes_json
                ? {
                      default_attributes: JSON.parse(
                          req.body.default_attributes_json,
                      ),
                  }
                : {}),
        };
    });
    static getFromatedProducts = Validator.ReqQuery(
        GetFormatedProductsSchema,
        (req) => {
            return {
                productLimit: parseInt(req.query.productLimit) || 4,
                categoryLimit: parseInt(req.query.categoryLimit) || 4,
            };
        },
    );
    static getProduct = Validator.ReqParams(GetProductSchema);
    static getCursorPaginatedProducts = Validator.ReqQuery(GetCursorPaginatedProducts)
    static minimalInfo = Validator.ReqParams(GetMinimalInfoSchema)
}
export default ProductValidator;

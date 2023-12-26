import { CreateProductSchema } from "./schema/create";
import Validator from "@/utils/validatorWrapper.";
import {
    GetFormatedProductsSchema,
    GetProductPriceSectionSchema,
    GetProductsSchema,
} from "./schema/read";
import { DeleteProduct } from "./schema/delete";
import { ProductIdSchema } from "./schema/main";

class ProductValidator {
    static createProduct = Validator.ReqBody(CreateProductSchema, (req) => {
        return {
            ...req.body,
            sections: JSON.parse(req.body.sections_json),
            default_attributes: JSON.parse(req.body.default_attributes_json),
            featured: req.body.featured === "true",
        };
    });
    static getProducts = Validator.ReqQuery(GetProductsSchema,(req) => {
        console.log(req.query)
        return    req.query
    });

    static getProductPriceSections = Validator.ReqParams(GetProductPriceSectionSchema);
    static deleteProduct = Validator.ReqParams(DeleteProduct);
    static getFromatedProducts = Validator.ReqQuery(
        GetFormatedProductsSchema,
        (req) => {
            return {
                productLimit: parseInt(req.query.productLimit) || 4,
                categoryLimit: parseInt(req.query.categoryLimit) || 4,
            };
        }
    );
    static validateIdInParams = Validator.ReqParams(ProductIdSchema)
    // static getProduct = Validator.ReqParams(GetProduct);
}
export default ProductValidator;

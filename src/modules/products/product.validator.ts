import { CreateProductSchema } from "./schema/create";
import Validator from "@/utils/validatorWrapper.";
import { GetProductAttributes, GetProductsSchema } from "./schema/read";

class ProductValidator {
    static createProduct = Validator.ReqBody(CreateProductSchema, (req) => {
        console.log('here product validate just checking validation remove when you got time')
        return {
            // name: req.body.name,
            // category: req.body.category,
            // description: req.body.description,
            // price: req.body.price,
            // status: req.body.status,
            ...req.body,
            price_attributes: JSON.parse(req.body.price_attributes_json),
            default_prices: JSON.parse(req.body.default_prices_json),
            featured: req.body.featured === "true",
        };
    });
    static getProducts = Validator.ReqQuery(GetProductsSchema, (req) => {
        return {
            ...req.query,
            min: parseInt(req.query.min),
            max: parseInt(req.query.max),
            featured: req.query.featured === "true",
        };
    });

    static getProductAttributes = Validator.ReqParams(GetProductAttributes);
}
export default ProductValidator;

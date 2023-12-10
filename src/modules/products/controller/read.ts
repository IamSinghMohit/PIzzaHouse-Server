import { Request, Response, NextFunction } from "express";
import {
    TGetFromatedProductsSchema,
    TGetProductAttributesSchema,
    TGetProductSchema,
    TGetProductsSchema,
} from "../schema/read";
import ProductService from "../service/product.service";
import { ResponseService } from "@/services";
import ProductDefaultPriceSerivice from "../service/productDefaultPrice.service";
import ProductAttributeService from "../service/productAttribute.service";
import { ErrorResponse } from "@/utils";

class ProductRead {
    static async getProducts(
        req: Request<{}, {}, {}, TGetProductsSchema>,
        res: Response,
        next: NextFunction
    ) {
        const { category, status, min, max, featured, name } = req.query;

        const query: Record<string, any> = {
            ...(name ? { name: { $regex: new RegExp(name, "i") } } : {}),
            ...(category ? { category } : {}),
            ...(status ? { status } : {}),
            ...(featured ? { featured } : {}),
        };

        if (min && max) {
            query.price = { $gte: min, $lte: max };
        } else if (min) {
            query.price = { $gte: min };
        } else if (max) {
            query.price = { $lte: max };
        }

        const products = await ProductService.find(query, "FIND");
        ResponseService.sendResWithData(res, 202, {
            data: products,
        });
    }

    static async getProductAttributes(
        req: Request<TGetProductAttributesSchema, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) {
        const { id } = req.params;
        const isProductExists = ProductService.find(
            { _id: id as any },
            "FINDONE"
        );
        if (!isProductExists)
            return next(new ErrorResponse("product not found", 404));

        const attribute = await ProductAttributeService.findMany({
            product_id: id,
        });
        const defaultPriceAttribute = await ProductDefaultPriceSerivice.find(
            {
                product_id: id,
            },
            "FINDONE"
        );

        ResponseService.sendResWithData(res, 200, {
            attributes: attribute,
            default_prices: defaultPriceAttribute?.default_prices,
        });
    }

    static async getFromatedProducts(
        req: Request<{}, {}, {}, TGetFromatedProductsSchema>,
        res: Response,
        next: NextFunction
    ) {
        const products = await ProductService.getFormatedProducts(
            req.query.productLimit || 4,
            req.query.categoryLimit || 4
        );
        ResponseService.sendResWithData(res, 200, products);
    }

    static async getProduct(
        req: Request<TGetProductSchema>,
        res: Response,
        next: NextFunction
    ) {
        const product = await ProductService.find(
            { _id: req.params.id },
            "FINDONE"
        );
        ResponseService.sendResWithData(res, 200, product);
    }
}
export default ProductRead;

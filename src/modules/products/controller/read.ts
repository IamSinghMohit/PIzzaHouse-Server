import { Request, Response, NextFunction } from "express";
import {
    GetProductAttributesType,
    GetProductsSchemaType,
} from "../schema/read";
import ProductService from "../service/product.service";
import { ResponseService } from "@/services";
import ProductDefaultPriceSerivice from "../service/productDefaultPrice.service";
import ProductAttributeService from "../service/productAttribute.service";
import { ErrorResponse } from "@/utils";

class ProductRead {
    static async getProducts(
        req: Request<{}, {}, {}, GetProductsSchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const { category, status, min, max, featured, name } = req.query;

        const products = await ProductService.find(
            {
                ...(name ? { name: { $regex: new RegExp(name, "i") } } : {}),
                ...(category ? { category } : {}),
                ...(status ? { status } : {}),
                ...(featured ? { featured } : {}),
                price: { $gte: min, $lte: max },
            },
            "FIND"
        );
        ResponseService.sendResWithData(res, 202, {
            data: products,
        });
    }

    static async getProductAttributes(
        req: Request<GetProductAttributesType, {}, {}, {}>,
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
            data: {
                attributes: attribute,
                default_prices: defaultPriceAttribute?.default_prices,
            },
        });
    }
}
export default ProductRead;

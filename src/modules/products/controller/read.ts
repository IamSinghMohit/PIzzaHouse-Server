import { Request, Response, NextFunction } from "express";
import {
    TGetFromatedProductsSchema,
    TGetProductPriceSectionSchema,
    TGetProductSchema,
    TGetProductsSchema,
} from "../schema/read";
import ProductService from "../service/product.service";
import { ResponseService } from "@/services";
import { ErrorResponse } from "@/utils";
import AdminProductDto from "../dto/product/admin";
import ProductPriceSectionService from "../service/productPriceSection";
import ProductDefaultPriceAttributeSerivice from "../service/productDefaultAttribute.service";
import ProductPriceSectionDto from "../dto/productPriceSection.dto";

class ProductRead {
    static async products(
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
        ResponseService.sendResponse(
            res,
            202,
            true,
            products.map((product) => new AdminProductDto(product))
        );
    }

    static async productPriceSection(
        req: Request<TGetProductPriceSectionSchema, {}, {}, {}>,
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

        const sections = await ProductPriceSectionService.findMany({
            product_id: id,
        });
        const defaultPriceAttribute =
            await ProductDefaultPriceAttributeSerivice.findOne({
                product_id: id,
            });

        ResponseService.sendResponse(res, 200, true, {
            sections: sections.map((sec) => new ProductPriceSectionDto(sec)),
            default_attributes: defaultPriceAttribute?.attribute,
        });
    }

    static async fromatedProducts(
        req: Request<{}, {}, {}, TGetFromatedProductsSchema>,
        res: Response,
        next: NextFunction
    ) {
        const products = await ProductService.getFormatedProducts(
            req.query.productLimit || 4,
            req.query.categoryLimit || 4
        );
        ResponseService.sendResponse(res, 200, true, products);
    }

    static async product(
        req: Request<TGetProductSchema>,
        res: Response,
        next: NextFunction
    ) {
        const product = await ProductService.find(
            { _id: req.params.id },
            "FINDONE"
        );
        ResponseService.sendResponse(res, 200, true, product);
    }
}
export default ProductRead;

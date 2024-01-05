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
import BaseProductDto from "../dto/product/base";

class ProductRead {
    static async products(
        req: Request<{}, {}, {}, TGetProductsSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { category, status, min, max, featured, name, limit, page } =
            req.query;
        const originalLimit = limit || 10;
        const originalPage = page || 1;

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

        const products = await ProductService.findPaginatedProducts(query, {
            limit: originalLimit,
            skip: (originalPage - 1) * originalLimit,
        });

        ResponseService.sendResponse(res, 202, true, {
            products: products.map((product) => new AdminProductDto(product)),
            pages: Math.ceil(1 / originalLimit),
        });
    }

    static async productPriceSection(
        req: Request<TGetProductPriceSectionSchema, {}, {}, {}>,
        res: Response,
        next: NextFunction,
    ) {
        const { id } = req.params;
        const isProductExists = await ProductService.find(
            { _id: id as any },
            "FINDONE",
        );
        if (!isProductExists) {
            return next(new ErrorResponse("product not found", 404));
        }
        const sections = await ProductPriceSectionService.findMany({
            product_id: id,
        });
        const defaultPriceAttribute =
            await ProductDefaultPriceAttributeSerivice.findOne({
                product_id: id,
            });

        ResponseService.sendResponse(res, 200, true, {
            sections: sections.map((sec) => new ProductPriceSectionDto(sec)),
            default_attributes: defaultPriceAttribute?.attributes || [],
        });
    }

    static async fromatedProducts(
        req: Request<{}, {}, {}, TGetFromatedProductsSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const products = await ProductService.getFormatedProducts(
            req.query.productLimit || 4,
            req.query.categoryLimit || 4,
        );
        ResponseService.sendResponse(res, 200, true, products);
    }

    static async product(
        req: Request<TGetProductSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const product = await ProductService.find(
            { _id: req.params.id },
            "FINDONE",
        );
        if (product) {
            ResponseService.sendResponse(
                res,
                200,
                true,
                new BaseProductDto(product),
            );
        } else {
            return next(new ErrorResponse("Product does not exist", 404));
        }
    }

    static async stats(
        req: Request<TGetProductSchema>,
        res: Response,
        next: NextFunction,
    ) {
        ResponseService.sendResponse(res, 200, true, {
            max_price: 5000,
        });
    }
}
export default ProductRead;

import { Request, Response, NextFunction } from "express";
import {
    TGetCursorPaginatedProducts,
    TGetFromatedProductsSchema,
    TGetMinimalInfoSchema,
    TGetProductPriceSectionSchema,
    TGetProductSchema,
    TGetProductsSchema,
} from "../schema/read";
import { ResponseService } from "@/services";
import { ErrorResponse } from "@/utils";
import AdminProductDto from "../dto/product/admin";
import ProductPriceSectionDto from "../dto/productPriceSection.dto";
import BaseProductDto from "../dto/product/base";
import { ProductModel } from "../models/product.model";
import { ProductPriceSectionModel } from "../models/productPriceSection.model.ts";
import { ProductDefaultPriceAttributModel } from "../models/productDefaultAttribute.model";

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
        const result = await Promise.all([
            ProductModel.find(query)
                .limit(originalLimit)
                .skip((originalPage - 1) * originalLimit)
                .lean()
                .cacheQuery(),
            ProductModel.find(query).count().cacheQuery(),
        ]);
        const [products, totalDocument] = result;

        ResponseService.sendResponse(res, 202, true, {
            products: products.map((product) => new AdminProductDto(product)),
            pages: Math.ceil(totalDocument / originalLimit),
            page: originalPage,
        });
    }

    static async productPriceSection(
        req: Request<TGetProductPriceSectionSchema, {}, {}, {}>,
        res: Response,
        next: NextFunction,
    ) {
        const { id } = req.params;
        const product = await ProductModel.findOne({ _id: id }).lean();
        if (!product) {
            return next(new ErrorResponse("product not found", 404));
        }
        const result = await Promise.all([
            ProductPriceSectionModel.find({
                _id: { $in: product.sections },
            })
                .lean()
                .cacheQuery(),
            ProductDefaultPriceAttributModel.findOne({
                _id: product.default_attribute,
            })
                .lean()
                .cacheQuery(),
        ]);
        const [sections, defaultPriceAttribute] = result;
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
        const productLimit = req.query.productLimit || 4;
        const categoryLimit = req.query.categoryLimit || 4;
        const products = await ProductModel.aggregate([
            {
                $match: {
                    featured: true,
                },
            },
            {
                $group: {
                    _id: "$category",
                    products: {
                        $push: {
                            id: "$_id",
                            name: "$name",
                            category: "$category",
                            description: "$description",
                            price: "$price",
                            image: "$image",
                            price_attributes: "$price_attributes",
                            default_prices: "$default_prices",
                        },
                    },
                },
            },
            {
                $addFields: {
                    id: "$_id",
                    category: "$_id",
                },
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    category: 1,
                    products: { $slice: ["$products", productLimit] },
                },
            },
            {
                $limit: categoryLimit,
            },
        ]).cachePipeline();

        ResponseService.sendResponse(res, 200, true, products);
    }

    static async product(
        req: Request<TGetProductSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const product = await ProductModel.findOne({
            _id: req.params.id,
        })
            .lean()
            .cacheQuery();
        if (!product) {
            return next(new ErrorResponse("Product does not exist", 404));
        }
        ResponseService.sendResponse(
            res,
            200,
            true,
            new BaseProductDto(product),
        );
    }

    static async stats(
        req: Request<TGetProductSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const product = await ProductModel.findOne({})
            .sort({ price: -1 })
            .limit(1)
            .lean()
            .cacheQuery();
        ResponseService.sendResponse(res, 200, true, {
            max_price: (product?.price || 0) + 10,
        });
    }

    static async CursorPaginated(
        req: Request<{}, {}, {}, TGetCursorPaginatedProducts>,
        res: Response,
        next: NextFunction,
    ) {
        const { category, min, max, limit, name, cursor } = req.query;

        const originalLimit = limit || 10;
        let categories: string[] = [];

        if (category && category.length > 0) {
            categories = category?.split(",").map((id) => id.trim());
        }

        const query: Record<string, any> = {
            ...(name
                ? {
                      name: {
                          $regex: new RegExp(name, "i"),
                      },
                  }
                : {}),
            ...(cursor ? { _id: { $gt: cursor } } : {}),
            ...(categories?.length > 0
                ? { category: { $in: categories } }
                : {}),
        };

        if (min && max) {
            query.price = { $gte: min, $lte: max };
        } else if (min) {
            query.price = { $gte: min };
        } else if (max) {
            query.price = { $lte: max };
        }
        const products = await ProductModel.find(query)
            .limit(originalLimit)
            .lean()
            .cacheQuery();
        ResponseService.sendResponse(
            res,
            202,
            true,
            products.map((pro) => new BaseProductDto(pro)),
        );
    }

    static async minimalInfo(
        req: Request<TGetMinimalInfoSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const id = req.params.id;
        let query = {};
        if (id) {
            query = { _id: { $gt: id } };
        }
        const products = await ProductModel.find(query)
            .limit(20)
            .select("name category")
            .lean()
            .cacheQuery();
        return ResponseService.sendResponse(
            res,
            200,
            true,
            products.map((pro) => ({
                id: pro._id,
                name: pro.name,
                category: pro.category,
            })),
        );
    }
}
export default ProductRead;

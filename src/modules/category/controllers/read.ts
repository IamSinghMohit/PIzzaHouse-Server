import { NextFunction, Request, Response } from "express";
import { ResponseService } from "@/services";
import {
    TSearchCategorySchema,
    TGetCategoriesSchema,
    TGetCategorySectionsShchema,
} from "../schema/read";
import AdminCategoryDto from "../dto/category/admin";
import AdminCategoryPriceSectionDto from "../dto/categoryPriceSection.dto";
import { CategoryModel } from "../models/category.model";
import { CategoryPriceSectionModel } from "../models/categoryPriceSection";

class CategoryRead {
    static async getCategories(
        req: Request<{}, {}, {}, TGetCategoriesSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { limit, name, page } = req.query;
        const originalLimit = limit || 10;
        const originalPage = page || 1;

        const query = {
            ...(name ? { name: new RegExp(name, "i") } : {}),
        };

        const result = await Promise.all([
            CategoryModel.find(query)
                .limit(originalLimit)
                .skip((originalPage - 1) * originalLimit)
                .cacheQuery(),

            CategoryModel.find(query).count(),
        ]);
        const [categories, totalDocument] = result;

        ResponseService.sendResponse(res, 202, true, {
            page: originalPage,
            pages: Math.ceil(totalDocument / originalLimit),
            categories: categories.map((cat) => new AdminCategoryDto(cat)), // don't mess up here, this must remain unchanged
        });
    }

    static async searchCategory(
        req: Request<{}, {}, {}, TSearchCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { cursor, name, limit } = req.query;

        const categories = await CategoryModel.find({
            name: {
                $regex: new RegExp(name, "i"),
            },
            ...(cursor ? { _id: { $lt: cursor } } : {}),
        })
            .sort({ _id: -1 })
            .limit(limit)
            .cacheQuery();

        ResponseService.sendResponse(
            res,
            200,
            true,
            categories.map((cat) => new AdminCategoryDto(cat)),
        );
    }

    static async getSections(
        req: Request<TGetCategorySectionsShchema, {}, {}>,
        res: Response,
        next: NextFunction,
    ) {
        const priceAtt = await CategoryPriceSectionModel.find({
            category_id: req.params.id,
        }).cacheQuery()
        ResponseService.sendResponse(
            res,
            202,
            true,
            priceAtt.map((at) => new AdminCategoryPriceSectionDto(at)),
        );
    }
}
export default CategoryRead;

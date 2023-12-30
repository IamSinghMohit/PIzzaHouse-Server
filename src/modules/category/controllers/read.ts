import { NextFunction, Request, Response } from "express";
import CategoryService from "../service/category.service";
import CategoryAttributeService from "../service/categoryPriceSection.service";
import { ResponseService } from "@/services";
import {
    TSearchCategorySchema,
    TGetCategoriesSchema,
    TGetCategorySectionsShchema,
} from "../schema/read";
import AdminCategoryDto from "../dto/category/admin";
import AdminCategoryPriceSectionDto from "../dto/categoryPriceSection.dto";

class CategoryRead {
    static async getCategories(
        req: Request<{}, {}, {}, TGetCategoriesSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const totalDocument = await CategoryService.count();
        const { limit, name } = req.query;
        const page = req.query.page;

        const categories = await CategoryService.findPaginatedCategory(
            { ...(name ? { name: new RegExp(name, "i") } : {}) },
            {
                limit,
                skip: (page - 1) * limit,
            },
        );

        ResponseService.sendResponse(res, 202, true, {
            page,
            pages: Math.ceil(totalDocument / limit),
            categories: categories.map((cat) => new AdminCategoryDto(cat)), // don't mess up here, this must remain unchanged
        });
    }

    static async searchCategory(
        req: Request<{}, {}, {}, TSearchCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const categories = await CategoryService.searchCategory(
            req.query.name,
            req.query.limit,
            req.query.cursor,
        );
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
        const priceAtt = await CategoryAttributeService.getSections({
            category_id: req.params.id,
        });
        ResponseService.sendResponse(
            res,
            202,
            true,
            priceAtt.map((at) => new AdminCategoryPriceSectionDto(at)),
        );
    }

    static async getCategoriesAdmin(
        req: Request<{}, {}, {}, TSearchCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const categories = await CategoryService.find({}, "FIND");
        ResponseService.sendResponse(
            res,
            200,
            true,
            categories.map((cat) => new AdminCategoryDto(cat)),
        );
    }
}
export default CategoryRead;

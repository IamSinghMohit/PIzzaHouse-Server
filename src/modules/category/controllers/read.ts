import { NextFunction, Request, Response } from "express";
import CategoryService from "../service/category.service";
import CategoryAttrService from "../service/categoryAttr.service";
import { ResponseService } from "@/services";
import {
    GetAttributeSchemaType,
    SearchCategorySchemaType,
    getCategoriesSchemaType,
} from "../schema/read";

class CategoryRead {
    static async getCategories(
        req: Request<{}, {}, {}, getCategoriesSchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const totalDocument = await CategoryService.count();
        const { limit } = req.query;
        const page = req.query.page;

        const categories = await CategoryService.findPaginatedCategory(
            {},
            {
                limit,
                skip: (page - 1) * limit,
            }
        );
        ResponseService.sendResWithData(res, 202, {
            page,
            pages: Math.ceil(totalDocument / limit),
            data: categories,
        });
    }

    static async searchCategory(
        req: Request<{}, {}, {}, SearchCategorySchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const categories = await CategoryService.searchCategory(
            req.query.name,
            req.query.limit,
            req.query.cursor
        );
        ResponseService.sendResWithData(res, 200, {
            data: categories,
        });
    }

    static async getAttributes(
        req: Request<GetAttributeSchemaType, {}, {}>,
        res: Response,
        next: NextFunction
    ) {
        const priceAtt = await CategoryAttrService.getAttribute({
            categoryId: req.params.id,
        });
        ResponseService.sendResWithData(res, 202,priceAtt);
    }
}
export default CategoryRead;

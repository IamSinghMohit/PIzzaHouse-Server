import { NextFunction, Request, Response } from "express";
import { TDeleteCategorySchema } from "../schema/delete";
import CategoryService from "../service/category.service";
import { ResponseService } from "@/services";
import { ErrorResponse } from "@/utils";
import { ProductModel } from "@/modules/products/models/product.model";
import { ProductDefaultPriceAttributModel } from "@/modules/products/models/productDefaultAttribute.model";
import { ProductPriceSectionModel } from "@/modules/products/models/productPriceSection.model.ts";
import { TopingModel } from "@/modules/topings/topings.model";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";
import { CategoryModel } from "../models/category.model";

class CategoryDelete {
    static async deleteCategory(
        req: Request<TDeleteCategorySchema, {}, {}>,
        res: Response,
        next: NextFunction,
    ) {
        const { id } = req.params;
        const category = await CategoryService.find({ _id: id }, "FINDONE");

        if (!category) {
            return new ErrorResponse("category not found", 404);
        }
        await Promise.all([
            CategoryModel.deleteOne({
                _id: category._id,
            }),
            ProductModel.deleteMany({
                category: category.name,
            }),
            ProductDefaultPriceAttributModel.deleteOne({
                category: category.name,
            }),
            ProductPriceSectionModel.deleteMany({
                category: category.name,
            }),
            TopingModel.deleteMany({
                category: category.name,
            }),
        ]);
        ResponseService.sendResponse(res, 200, true, "Category deleted");
        await AddToDeleteImageQueue({
            tag: `categoryId:${category._id}`,
        });
    }
}
export default CategoryDelete;

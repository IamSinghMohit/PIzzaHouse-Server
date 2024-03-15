import { NextFunction, Request, Response } from "express";
import { TDeleteCategorySchema } from "../schema/delete";
import CategoryService from "../service/category.service";
import { ResponseService } from "@/services";
import { ErrorResponse } from "@/utils";
import { ProductModel } from "@/modules/products/models/product.model";
import { ProductDefaultPriceAttributModel } from "@/modules/products/models/productDefaultAttribute.model";
import { ProductPriceSectionModel } from "@/modules/products/models/productPriceSection.model.ts";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";
import { CategoryModel } from "../models/category.model";
import mongoose from "mongoose";
import { TopingModel } from "@/modules/topings/topings.model";
import { CategoryPriceSectionModel } from "../models/categoryPriceSection";

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
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            await Promise.all([
                CategoryModel.deleteOne(
                    {
                        _id: category._id,
                    },
                    { session },
                ),
                CategoryPriceSectionModel.deleteMany({
                    category_id: category._id,
                }),
                ProductModel.deleteMany(
                    {
                        category: category.name,
                    },
                    { session },
                ),
                ProductDefaultPriceAttributModel.deleteOne(
                    {
                        category: category.name,
                    },
                    { session },
                ),
                ProductPriceSectionModel.deleteMany(
                    {
                        category: category.name,
                    },
                    { session },
                ),
                TopingModel.updateMany(
                    { category: category.name },
                    { $pull: { category: category.name } },
                    { session },
                ),
            ]);

            ResponseService.sendResponse(res, 200, true, "Category deleted");
            await AddToDeleteImageQueue({
                tag: `categoryId:${category._id}`,
            });
        });
        await session.endSession();
    }
}
export default CategoryDelete;

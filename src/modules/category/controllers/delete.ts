import { NextFunction, Request, Response } from "express";
import { TDeleteCategorySchema } from "../schema/delete";
import { ImageService } from "@/services";
import CategoryService from "../service/category.service";
import { ResponseService } from "@/services";
import { ErrorResponse } from "@/utils";
import CategoryPriceSectionService from "../service/categoryPriceSection.service";
import { StatusEnum } from "@/modules/schema";
import { ProductModel } from "@/modules/products/models/product.model";
import { ProductDefaultPriceAttributModel } from "@/modules/products/models/productDefaultAttribute.model";
import { ProductPriceSectionModel } from "@/modules/products/models/productPriceSection.model.ts";
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
        const url = category.image.split("/");
        const image = `${process.env.CLOUDINARY_CAEGORY_FOLDER}/${
            url[url.length - 1].split(".")[0]
        }`;
        // await ImageService.deleteUsingTag(image).catch((e) => next(e));
        // deleting data releated cateogry
        await CategoryService.delete({ _id: id });
        await CategoryPriceSectionService.deleteMany({ category_id: id });
        // updating the product
        ProductModel.updateMany(
            { category: category.name },
            {
                $set: {
                    status: StatusEnum.DRAFT,
                    featured: false,
                    price: 0,
                    category: "",
                },
            },
        );
        // delting the product data releated to category
        await ProductDefaultPriceAttributModel.deleteOne({
            category: category.name,
        });
        ProductPriceSectionModel.deleteMany({ category: category.name });
        ResponseService.sendResponse(res, 200, true, "Category deleted");
    }
}
export default CategoryDelete;

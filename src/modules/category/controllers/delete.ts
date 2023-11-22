import { NextFunction, Request, Response } from "express";
import { DeleteCategorySchemaType } from "../schema/delete";
import { ImageService } from "@/services";
import CategoryService from "../service/category.service";
import ProductService from "@/modules/products/service/product.service";
import { ResponseService } from "@/services";
import CategoryAttrService from "../service/categoryAttributes.service";
import ProductDefaultPriceSerivice from "@/modules/products/service/productDefaultPrice.service";
import ProductAttributeService from "@/modules/products/service/productAttribute.service";
import { ErrorResponse } from "@/utils";
import mongoose, { ClientSession } from "mongoose";

class CategoryDelete {
    static async deleteCategory(
        req: Request<DeleteCategorySchemaType, {}, {}>,
        res: Response,
        next: NextFunction
    ) {
        const { id } = req.params;
        const category = await CategoryService.findCategory(
            { _id: id },
            "FINDONE"
        );
        if (!category) {
            return new ErrorResponse("category not found", 404);
        }
        const url = category.image.split("/");
        const image = `${process.env.CLOUDINARY_CAEGORY_FOLDER}/${
            url[url.length - 1].split(".")[0]
        }`;
        ImageService.deleteImage(image, async () => {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                // deleting data releated cateogry
                CategoryService.deleteCategory(id);
                CategoryAttrService.deleteAttribute(id);
                // deleting data releated category in product
                const results = await ProductService.UpdateMany(
                    { category: category.name },
                    { category: "others" },
                    ['price_attributes_id','default_prices_id']
                );
                console.log(results)
                return new Error('failed oops')
                ProductAttributeService.deleteMany({ category: category?.name });
                ProductDefaultPriceSerivice.deleteMany({
                    category: category?.name,
                });
            } catch (error) {
                session.abortTransaction();
                next(new ErrorResponse("failed delete category", 500));
            } finally {
                ResponseService.sendResWithData(res, 200, {
                    data: "Category deleted",
                });
            }
        });
    }
}
export default CategoryDelete;

import { NextFunction, Request, Response } from "express";
import { TDeleteCategorySchema } from "../schema/delete";
import { ImageService } from "@/services";
import CategoryService from "../service/category.service";
import ProductService from "@/modules/products/service/product.service";
import { ResponseService } from "@/services";
import CategoryAttrService from "../service/categoryPriceSection.service";
import { ErrorResponse } from "@/utils";
import ProductDefaultPriceAttributeService from "@/modules/products/service/productDefaultAttribute.service";
import ProductPriceSectionService from "@/modules/products/service/productPriceSection";

class CategoryDelete {
    static async deleteCategory(
        req: Request<TDeleteCategorySchema, {}, {}>,
        res: Response,
        next: NextFunction
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
        ImageService.deleteImage(image, async () => {
            // deleting data releated cateogry
            CategoryService.deleteCategory(id);
            CategoryAttrService.deleteAttribute(id);
            // updating the product
            ProductService.UpdateMany(
                { category: category.name },
                {
                    $set: {
                        category: "Others",
                    },
                }
            );
            // delting the product data releated to category
            ProductDefaultPriceAttributeService.deleteOne({ category: category.name });
            ProductPriceSectionService.deleteMany({ category: category.name });

            ResponseService.sendResponse(res, 200, true, "Category deleted");
        });
    }
}
export default CategoryDelete;

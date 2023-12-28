import { NextFunction, Request, Response } from "express";
import { TDeleteCategorySchema } from "../schema/delete";
import { ImageService } from "@/services";
import CategoryService from "../service/category.service";
import ProductService from "@/modules/products/service/product.service";
import { ResponseService } from "@/services";
import { ErrorResponse } from "@/utils";
import ProductDefaultPriceAttributeService from "@/modules/products/service/productDefaultAttribute.service";
import ProductPriceSectionService from "@/modules/products/service/productPriceSection";
import CategoryPriceSectionService from "../service/categoryPriceSection.service";
import { ProductStatusEnum } from "@/modules/products/schema/main";

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
        await ImageService.deleteImage(image).catch((e) => next(e));
        // deleting data releated cateogry
        await CategoryService.delete({ _id: id });
        await CategoryPriceSectionService.deleteMany({ category_id: id });
        // updating the product
        ProductService.update(
            { category: category.name },
            {
                $set: {
                    status: ProductStatusEnum.DRAFT,
                    featured: false,
                    price: 0,
                    category: "",
                },
            },
            "UPDATEMANY",
        );
        // delting the product data releated to category
        await ProductDefaultPriceAttributeService.deleteOne({
            category: category.name,
        });
        ProductPriceSectionService.deleteMany({ category: category.name });
        ResponseService.sendResponse(res, 200, true, "Category deleted");
    }
}
export default CategoryDelete;

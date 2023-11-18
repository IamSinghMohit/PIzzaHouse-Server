import { NextFunction, Request, Response } from "express";
import { DeleteCategorySchemaType } from "../schema/delete";
import { ImageService } from "@/services";
import CategoryService from "../service/category.service";
import ProductService from "@/modules/products/service/product.service";
import { ResponseService } from "@/services";
import CategoryAttrService from "../service/categoryAttr.service";
import { ErrorResponse } from "@/utils";

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
        const image = url[url.length - 1].split(".")[0];
        ImageService.deleteImage(image, () => {
            CategoryService.deleteCategory(id);
            CategoryAttrService.deleteAttribute(id);
            ProductService.UpdateMany({ category: id }, { category: "others" });
            ResponseService.sendResWithData(res, 200, {
                data: "Category deleted",
            });
        });
    }
}
export default CategoryDelete;

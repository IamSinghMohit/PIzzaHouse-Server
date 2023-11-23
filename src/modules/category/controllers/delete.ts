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
import { ProductModel } from "@/modules/products/models/product.model";

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
                // deleting data releated cateogry
                // CategoryService.deleteCategory(id);
                // CategoryAttrService.deleteAttribute(id);
                // deleting data releated category in product
                // const results = await ProductService.UpdateMany(
                //     { category: category.name },
                //     { $set:{
                //         category: "others" 
                //     }},
                //     ['price_attributes_id','default_prices_id']
                // );
                const results = ProductModel.updateMany(
                    { category: category.name },
                    { $set:{
                        category: "others" 
                    }},
                    {
                        new:true
                    }
                ).select('price_attributes_id default_prices_id')
                console.log(results)
                ResponseService.sendResWithData(res, 200, {
                    data: "Category deleted",
                });
        });
    }
}
export default CategoryDelete;

// first start the session
// first delete category
// do updateMany in products and only get default_price and price_attributes array 
// do deleteMany many on both the collections using their ids

import { Request, Response, NextFunction } from "express";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";

class ProductDelete {
    static async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const product = await ProductService.find(
            { _id: id as any },
            "FINDONE"
        );
        if (!product) {
            return new ErrorResponse("category not found", 404);
        }
        const url = product.image.split("/");

        const image = `${process.env.CLOUDINARY_PRODUCT_FOLDER}/${
            url[url.length - 1].split(".")[0]
        }`;
        ImageService.deleteImage(image, () => {
            // deleting data releated category in product
            ResponseService.sendResWithData(res, 200, {
                data: "Category deleted",
            });
        });
    }
}
export default ProductDelete;

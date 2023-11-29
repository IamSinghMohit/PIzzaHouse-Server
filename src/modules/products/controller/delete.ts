import { Request, Response, NextFunction } from "express";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import ProductAttributeService from "../service/productAttribute.service";
import ProductDefaultPriceSerivice from "../service/productDefaultPrice.service";

class ProductDelete {
    static async delete(req: Request, res: Response, next: NextFunction) {
        console.log('inside controller')
        const { id } = req.params;
        const product = await ProductService.find(
            { _id: id as any },
            "FINDONE"
        );
        if (!product) {
            return next(new ErrorResponse("product not found", 404))
        }
        const url = product.image.split("/");

        const image = `${process.env.CLOUDINARY_PRODUCT_FOLDER}/${
            url[url.length - 1].split(".")[0]
        }`;
        ImageService.deleteImage(image, () => {
            ProductService.delete({ _id: id as any });
            ProductAttributeService.deleteMany({ product_id: id });
            ProductDefaultPriceSerivice.deleteOne({ product_id: id });
            ResponseService.sendResWithData(res, 200, {
                data: "Product deleted",
            });
        });
    }
}
export default ProductDelete;

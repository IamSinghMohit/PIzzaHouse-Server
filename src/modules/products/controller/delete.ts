import { Request, Response, NextFunction } from "express";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import ProductPriceSectionService from "../service/productPriceSection";
import ProductDefaultPriceAttributeService from "../service/productDefaultAttribute.service";

class ProductDelete {
    static async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const product = await ProductService.find({ _id: id }, "FINDONE");
        if (!product) {
            return next(new ErrorResponse("product not found", 404));
        }
        const url = product.image.split("/");

        const image = `${process.env.CLOUDINARY_PRODUCT_FOLDER}/${
            url[url.length - 1].split(".")[0]
        }`;
        ImageService.deleteImage(image, () => {
            ProductService.delete({ _id: id });
            ProductPriceSectionService.deleteMany({ product_id: id });
            ProductDefaultPriceAttributeService.deleteOne({ product_id: id });
            ResponseService.sendResponse(res, 200, true, "Product deleted");
        });
    }
}
export default ProductDelete;

import { Request, Response, NextFunction } from "express";
import { ProductSchemaWithAttrType } from "../schema/product.schema";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import { Types } from "mongoose";
import { ImageService, ResponseService } from "@/services";
import ProductAttrService from "../service/productAtt.service";
import { ProductDto } from "../dto/product.dto";

class ProductController {
    static async createProduct(
        req: Request<{}, {}, ProductSchemaWithAttrType>,
        res: Response,
        next: NextFunction
    ) {
        const { name, price_attributes, price, category, description, status } =
            req.body;
        const isExist = await ProductService.findProduct({ name }, "FINDONE");
        if (isExist) {
            next(new ErrorResponse("product already exist", 403));
        }

        const product = ProductService.getInstance({
            name,
            category,
            price,
            description,
            status,
        });
        const AttributeArray: Types.ObjectId[] = [];

        const processedImage = await ImageService.compressImageToBuffer(req);

        await ImageService.uploadImageWithBuffer(
            processedImage,
            async (error, result) => {
                if (error) {
                    return next(
                        new ErrorResponse("Error while uploading image", 500)
                    );
                }

                if (result && result.url) {
                    product.image = result.url;
                }
                // saving product price attributes in the database
                price_attributes.forEach(({ attribute_title, attributes }) => {
                    const patt = ProductAttrService.getInstance({
                        attribute_title,
                        attributes,
                    });
                    AttributeArray.push(patt._id);
                    patt.save();
                });
                // saving image of product
                product.price_attributesId = AttributeArray;
                const ProductResult = await product.save();

                ResponseService.sendResWithData(
                    res,
                    202,
                    new ProductDto(ProductResult)
                );
            }
        );
    }
}
export default ProductController;

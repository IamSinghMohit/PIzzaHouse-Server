import { Request, Response, NextFunction } from "express";
import { CreateProductSchemaType } from "../schema/create";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import { ProductDto } from "../dto/product.dto";
import CategoryService from "@/modules/category/service/category.service";
import ProductAttrService from "../service/productAtt.service";
import { Types } from "mongoose";

class ProductCreate {
    static async createProduct(
        req: Request<{}, {}, CreateProductSchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const {
            name,
            price_attributes,
            categoryId,
            description,
            status,
        } = req.body;

        if (!req.file?.buffer)
            return next(new ErrorResponse("image is required", 422));
        const isExist = await ProductService.findProduct({ name }, "FINDONE");
        if (isExist) {
            return next(new ErrorResponse("product already exist", 403));
        }

        const product = ProductService.getInstance({
            name,
            description,
            status,
        });
        const AttributeArray: Types.ObjectId[] = [];
        const fetchedCategory = await CategoryService.findCategory(
            { _id: categoryId },
            "FINDONE"
        );
        if (!fetchedCategory) {
            return next(new ErrorResponse("category does not exist", 404));
        }
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
                product.category = fetchedCategory.name;
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
export default ProductCreate;

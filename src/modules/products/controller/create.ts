import { Request, Response, NextFunction } from "express";
import { CreateProductSchemaType } from "../schema/create";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import { ProductDto } from "../dto/product.dto";
import ProductAttributeService from "../service/productAttribute.service";
import ProductDefaultPriceSerivice from "../service/productDefaultPrice.service";
import CategoryService from "@/modules/category/service/category.service";
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
            category,
            description,
            status,
            featured,
            default_prices,
            price,
        } = req.body;

        if (!req.file?.buffer)
            return next(new ErrorResponse("image is required", 422));
        const isExist = await ProductService.find({ name }, "FINDONE");
        if (isExist) {
            return next(new ErrorResponse("product already exist", 403));
        }
        const isCategoryExists = await CategoryService.findCategory(
            { name: { $regex: new RegExp(category, "i") } },
            "FINDONE"
        );
        if (!isCategoryExists)
            return next(new ErrorResponse("category not  found", 404));

        const product = ProductService.getInstance({
            name,
            description,
            status,
        });
        const AttributeArray: Types.ObjectId[] = [];
        const processedImage = await ImageService.compressImageToBuffer(req);
        const folder = `${process.env.CLOUDINARY_PRODUCT_FOLDER}`;
        await ImageService.uploadImageWithBuffer(
            folder,
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
                    const patt = ProductAttributeService.getInstance({
                        attribute_title,
                        attributes: attributes,
                        category: category,
                    });
                    AttributeArray.push(patt._id);
                    patt.save();
                });
                // creating product_default_price document
                const productDefaultPrice =
                    await ProductDefaultPriceSerivice.create({
                        category: category,
                        default_prices: default_prices,
                    });
                // savving the product with other releated fields
                productDefaultPrice.save();
                product.price_attributes_id = AttributeArray;
                product.category = category;
                product.featured = featured;
                product.price = price;
                product.default_prices_id = productDefaultPrice._id

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

import { NextFunction, Request, Response } from "express";
import { TCreateProductSchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import { ProductModel } from "../models/product.model";
import { ProductDefaultPriceAttributModel } from "../models/productDefaultAttribute.model";
import { ProductPriceSectionModel } from "../models/productPriceSection.model.ts";
import { CategoryModel } from "@/modules/category/models/category.model";

class ProductUpdate {
    static async update(
        req: Request<{ id: string }, {}, Partial<TCreateProductSchema>>,
        res: Response,
        next: NextFunction,
    ) {
        const product = await ProductModel.findOne({ _id: req.params.id });

        const {
            name,
            category,
            price,
            status,
            featured,
            default_attributes,
            sections,
            description,
        } = req.body;
        const product_id = req.params.id;
        console.log(JSON.stringify(req.body));
        if (!product) {
            return next(new ErrorResponse("Product does not exist", 404));
        }
        if (featured) product.featured = featured;
        if (name) product.name = name;
        if (status) product.status = status;
        if (description) product.description = description;

        if (price && default_attributes && !sections) {
            product.price = price;
            await ProductDefaultPriceAttributModel.updateOne({
                attributes: default_attributes,
            });
        }
        if (sections && category) {
            const isCategoryExists = await CategoryModel.find({
                name: category,
            });
            if (!isCategoryExists) {
                return next(new ErrorResponse("Category  is not valid", 404));
            }
            product.category = category;
            await ProductPriceSectionModel.deleteMany({
                product_id: product_id,
            });
            for (let i = 0; i < sections.length; i++) {
                const sec = sections[i];
                await ProductPriceSectionModel.create({
                    name: sec.name,
                    product_id: product.id,
                    category: category,
                    attributes: sec.attributes,
                });
            }
        }
        if (req.file) {
            const url = product.image.split("/");

            const image = `${process.env.CLOUDINARY_PRODUCT_FOLDER}/${
                url[url.length - 1].split(".")[0]
            }`;
            await ImageService.deleteImage(image);
            const bufferedImage = await ImageService.compressImageToBuffer(req);
            const result = await ImageService.uploadImageWithBuffer(
                `${process.env.CLOUDINARY_PRODUCT_FOLDER}`,
                bufferedImage,
            );
            product.image = result.url;
        }
        await product.save();
        ResponseService.sendResponse(
            res,
            200,
            true,
            "Product updated successfully",
        );
    }
}
export default ProductUpdate;

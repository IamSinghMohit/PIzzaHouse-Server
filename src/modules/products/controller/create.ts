import { Request, Response, NextFunction } from "express";
import { TCreateProductSchema } from "../schema/create";
import { ErrorResponse } from "@/utils";
import { ImageService, ResponseService } from "@/services";
import CategoryService from "@/modules/category/service/category.service";
import AdminProductDto from "../dto/product/admin";
import {
    ProductPriceSectionModel,
    TProductPriceSection,
} from "../models/productPriceSection.model.ts";
import { ProductDefaultPriceAttributModel } from "../models/productDefaultAttribute.model";
import { ProductModel } from "../models/product.model";
import mongoose from "mongoose";
import { DocumentType } from "@typegoose/typegoose";

class ProductCreate {
    static async createProduct(
        req: Request<{}, {}, TCreateProductSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const {
            name,
            sections,
            category,
            description,
            status,
            featured,
            default_attributes,
            price,
        } = req.body;

        if (!req.file) return next(new ErrorResponse("image is required", 422));
        // checking if product already exist
        const isExist = await ProductModel.findOne({ name });
        if (isExist) {
            return next(new ErrorResponse("product already exist", 403));
        }

        // checking if provide category is valid
        const isCategoryExists = await CategoryService.find(
            { name: { $regex: new RegExp(category, "i") } },
            "FINDONE",
        );
        if (!isCategoryExists)
            return next(new ErrorResponse("category not  found", 404));

        // compressing the image
        const processedImage = await ImageService.compressImageToBuffer(req.file.buffer);
        const folder = `${process.env.CLOUDINARY_PRODUCT_FOLDER}`;

        // uploading the image
        const result = await ImageService.uploadImageWithBuffer(
            folder,
            processedImage,
        );

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const product = new ProductModel(
                {
                    image: result.url,
                    name,
                    description,
                    status,
                },
                { session },
            );
            const ProductSectionIdArray: string[] = [];
            const ProductSectionArray: Promise<
                DocumentType<TProductPriceSection>
            >[] = [];
            // creating product price sections
            sections.forEach(({ name, attributes }) => {
                const patt = new ProductPriceSectionModel(
                    {
                        product_id: product._id.toString(),
                        category: category,
                        name,
                        attributes: attributes,
                    },
                    { session },
                );
                ProductSectionIdArray.push(patt._id.toString());
                ProductSectionArray.push(patt.save());
            });

            // saving all the sections to the database
            Promise.all(ProductSectionArray);
            // creating product_default_price document
            const productDeafultAttribute =
                await ProductDefaultPriceAttributModel.create(
                    [
                        {
                            product_id: product._id.toString(),
                            category: category,
                            attributes: default_attributes,
                        },
                    ],
                    { session },
                );

            // savving the product with other releated fields
            product.sections = ProductSectionIdArray;
            product.category = category;
            product.featured = featured;
            product.price = price;
            product.default_attribute = productDeafultAttribute[0]._id;

            const ProductResult = await product.save();
            await session.commitTransaction();

            ResponseService.sendResponse(
                res,
                202,
                true,
                new AdminProductDto(ProductResult),
            );
        } catch (error) {
            const url = result.url;
            const image = `${process.env.CLOUDINARY_PRODUCT_FOLDER}/${
                url[url.length - 1].split(".")[0]
            }`;
            ImageService.deleteImage(image);
            await session.abortTransaction();
            next(new ErrorResponse("Error while creating product", 500));
        } finally {
            session.endSession();
        }
    }
}
export default ProductCreate;

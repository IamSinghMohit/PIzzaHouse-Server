import { NextFunction, Request, Response } from "express";
import { TCreateProductSchema } from "../schema/create";
import ProductService from "../service/product.service";
import { ErrorResponse } from "@/utils";
import ProductDefaultPriceAttributeService from "../service/productDefaultAttribute.service";
import ProductPriceSectionService from "../service/productPriceSection";
import { ImageService, ResponseService } from "@/services";
import CategoryService from "@/modules/category/service/category.service";

class ProductUpdate {
    static async update(
        req: Request<{ id: string }, {}, Partial<TCreateProductSchema>>,
        res: Response,
        next: NextFunction,
    ) {
        const product = await ProductService.find(
            { _id: req.params.id },
            "FINDONE",
        );

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
            return next(
                new ErrorResponse("Product with that id does not exist", 404),
            );
        }
        if (featured) product.featured = featured;
        if (name) product.name = name;
        if (status) product.status = status;
        if (description) product.description = description;

        if (price && default_attributes && !sections) {
            product.price = price;
            await ProductDefaultPriceAttributeService.updateOne({
                attributes: default_attributes,
            });
        }
        if (sections && category) {
            const isCategoryExists = await CategoryService.find(
                { name: category },
                "FINDONE",
            );
            if (!isCategoryExists) {
                return next(new ErrorResponse("Category  is not valid", 404));
            }

            product.category = category;
            await ProductPriceSectionService.deleteMany({
                product_id: product_id,
            });
            for (let i = 0; i < sections.length; i++) {
                const sec = sections[i];
                await ProductPriceSectionService.create({
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

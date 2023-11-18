import { NextFunction, Request, Response } from "express";
import { CreateCategorySchemaType } from "../schema/create";
import CategoryService from "../service/category.service";
import CategoryAttrService from "../service/categoryAttr.service";
import { ImageService } from "@/services";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import CategoryDto from "../dto/category.dto";
import { Types } from "mongoose";

class CategoryCreate {
    static async createCategory(
        req: Request<{}, {}, CreateCategorySchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const { name, price_attributes } = req.body;
        const isExist = await CategoryService.findCategory(
            { name: { $regex: new RegExp(name, "i") } },
            "FINDONE"
        );

        if (isExist) {
            return next(new ErrorResponse("Category already exist", 403));
        }

        const category = CategoryService.getInstance({ name });
        const AttributeArray: Types.ObjectId[] = [];

        const processedImage = await ImageService.compressImageToBuffer(req);
        // Uploading image to cloudinary and creating category
        ImageService.uploadImageWithBuffer(
            processedImage,
            async (error, result) => {
                if (error) {
                    return next(
                        new ErrorResponse("Error while uploading image", 500)
                    );
                }
                price_attributes.forEach(
                    async ({ attribute_title, attributes }) => {
                        const price_att = CategoryAttrService.getInstance({
                            categoryId: category.id,
                            attribute_title,
                            attributes: attributes,
                        });

                        AttributeArray.push(price_att._id);
                        price_att.save();
                    }
                );

                category.price_attributesId = AttributeArray;
                if (result && result.url) {
                    category.image = result.url;
                }
                const CatResult = await category.save();
                ResponseService.sendResWithData(res, 202, {
                    data: new CategoryDto(CatResult),
                });
            }
        );
    }
}
export default CategoryCreate;

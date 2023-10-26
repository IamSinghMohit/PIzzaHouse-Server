import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import CategoryService from "../service/category.service";
import CategoryAttrService from "../service/categoryAttr.service";
import { ResponseService, ImageService } from "@/services";
import { ErrorResponse } from "@/utils";
import { CategorySchemaType } from "../schema/category/create";
import { DeleteCategorySchemaType } from "../schema/category/delete";
import CategoryDto from "../dto/category.dto";
import ProductService from "@/modules/products/service/product.service";
import { SearchCategorySchemaType } from "../schema/category/read";

class CategoryController {
    static async craeteCategory(
        req: Request<{}, {}, CategorySchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const { name, price_attributes } = req.body;
        const isExist = await CategoryService.findCategory({ name }, "FINDONE");

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
                ResponseService.sendResWithData(
                    res,
                    202,
                    new CategoryDto(CatResult)
                );
            }
        );
    }

    static async getCategories(
        req: Request<{}, {}, CategorySchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const categories = await CategoryService.findCategory({}, "FIND");
        ResponseService.sendResWithData(res, 202, categories);
    }


    static async deleteCategory(
        req: Request<DeleteCategorySchemaType, {}, {}>,
        res: Response,
        next: NextFunction
    ) {
        const { id, image } = req.params;
        ImageService.deleteImage(image, () => {
            CategoryService.deleteCategory(id);
            CategoryAttrService.deleteAttribute(id);
            ProductService.UpdateMany({ category: id }, { category: "others" });
            ResponseService.sendResWithData(res, 200, {
                message: "Category deleted",
            });
        });
    }

    static async searchCategory(
        req: Request<{}, {}, {}, SearchCategorySchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const categories = await CategoryService.findCategory(
            {
                name: { $regex: req.query.name, $options: "i" },
            },
            "FIND"
        );
        ResponseService.sendResWithData(res,200,categories)
    }
}
export default CategoryController;

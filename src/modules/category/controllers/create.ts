import { NextFunction, Request, Response } from "express";
import { TCreateCategorySchema } from "../schema/create";
import CategoryService from "../service/category.service";
import CategoryAttributeService from "../service/categoryPriceSection.service";
import { ImageService } from "@/services";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import AdminCategoryDto from "../dto/category/admin";

class CategoryCreate {
    static async createCategory(
        req: Request<{}, {}, TCreateCategorySchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { name, sections } = req.body;
        console.log(req.body);

        const isExist = await CategoryService.find(
            { name: { $regex: new RegExp(name, "i") } },
            "FINDONE",
        );

        if (isExist) {
            return next(new ErrorResponse("Category already exist", 403));
        }

        const category = CategoryService.getInstance({ name });
        const AttributeArray: string[] = [];

        const processedImage = await ImageService.compressImageToBuffer(req);
        // Uploading image to cloudinary and creating category
        const folder = `${process.env.CLOUDINARY_CAEGORY_FOLDER}`;

        const result = await ImageService.uploadImageWithBuffer(
            folder,
            processedImage,
        ).catch((error) =>
            next(new ErrorResponse(error.message, error.http_code)),
        );

        sections.forEach(async ({ name, attributes }) => {
            const section = CategoryAttributeService.getInstance({
                category_id: category.id,
                name,
                attributes: attributes,
            });

            AttributeArray.push(section._id);
            section.save();
        });

        category.sections = AttributeArray;
        if (result && result.url) {
            category.image = result.url;
        }
        const CatResult = await category.save();
        ResponseService.sendResponse(
            res,
            202,
            true,
            new AdminCategoryDto(CatResult),
        );
    }
}
export default CategoryCreate;

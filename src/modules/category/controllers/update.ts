import { NextFunction, Request, Response } from "express";
import { ResponseService, ImageService } from "@/services";
import { ErrorResponse } from "@/utils";
import { UploadApiErrorResponse } from "cloudinary";
import { UpdateCategorySchemaType } from "../schema/update";
import CategoryService from "../service/category.service";
import CategoryPriceSectionService from "../service/categoryPriceSection.service";

class CategoryUpdate {
    private static async updateCategoryWithId(
        id: string,
        opts: Record<string, any>,
    ) {
        return await CategoryService.findOneAndUpdate({ _id: id }, opts);
    }

    private static async deleteAndCreatePriceSection(
        id: string,
        sections: UpdateCategorySchemaType["sections"],
    ) {
        await CategoryPriceSectionService.deleteMany({ category_id: id });
        const payload = sections.map((sec) => ({
            name: sec.name,
            attributes: sec.attributes,
            category_id: id,
        }));
        await CategoryPriceSectionService.create({
            type: "MANY",
            payload,
        });
    }

    private static response(res: Response) {
        return ResponseService.sendResponse(
            res,
            200,
            true,
            "Category updated successfully",
        );
    }

    static async updateCategory(
        req: Request<{}, {}, UpdateCategorySchemaType>,
        res: Response,
        next: NextFunction,
    ) {
        const {
            is_image_updated,
            is_name_updated,
            is_sections_updated,
            id,
            name,
            sections,
        } = req.body;
        if (is_image_updated) {
            let setImage: Function = () => {};

            if (is_name_updated && !is_sections_updated) {
                // if only name should be updated
                setImage = async (result: UploadApiErrorResponse) => {
                    await CategoryUpdate.updateCategoryWithId(id, {
                        image: result?.url,
                        name,
                    });
                };
            } else if (is_sections_updated && !is_name_updated) {
                // if only price_attributes should be updated
                setImage = async (result: UploadApiErrorResponse) => {
                    await CategoryUpdate.deleteAndCreatePriceSection(
                        id,
                        sections,
                    );
                    await CategoryUpdate.updateCategoryWithId(id, {
                        image: result?.url,
                    });
                };
            } else if (is_name_updated && is_sections_updated) {
                // if price attributes and name both should be updated
                setImage = async (result: UploadApiErrorResponse) => {
                    await CategoryUpdate.deleteAndCreatePriceSection(
                        id,
                        sections,
                    );
                    await CategoryUpdate.updateCategoryWithId(id, {
                        image: result?.url,
                        name,
                    });
                };
            }

            const processedImage =
                await ImageService.compressImageToBuffer(req);
            const folder = `${process.env.CLOUDINARY_CAEGORY_FOLDER}`;
            const result = ImageService.uploadImageWithBuffer(
                folder,
                processedImage,
            ).catch((err) =>
                next(new ErrorResponse("Error while uploading image", 500)),
            );
            setImage(result);
            CategoryUpdate.response(res);
        }
        if (is_name_updated && !is_image_updated) {
            await CategoryUpdate.updateCategoryWithId(id, { name });
        }
        if (is_sections_updated && !is_image_updated) {
            await CategoryUpdate.deleteAndCreatePriceSection(id, sections);
        }
        CategoryUpdate.response(res);
    }
}
export default CategoryUpdate;

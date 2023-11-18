import { NextFunction, Request, Response } from "express";
import { ResponseService, ImageService } from "@/services";
import { ErrorResponse } from "@/utils";
import { UploadApiErrorResponse } from "cloudinary";
import { UpdateCategorySchemaType } from "../schema/update";
import CategoryService from "../service/category.service";
import CategoryAttrService from "../service/categoryAttr.service";

class CategoryUpdate {
    private static async updateCategoryWithId(
        id: string,
        opts: Record<string, any>
    ) {
        return await CategoryService.findOneAndUpdate({ _id: id }, opts);
    }

    private static async deleteAndCreateAttr(
        id: string,
        price_attributes: UpdateCategorySchemaType["price_attributes"]
    ) {
        await CategoryAttrService.deleteMany({ categoryId: id });
        price_attributes?.forEach(async (att) => {
            await CategoryAttrService.create({
                attribute_title: att.attribute_title,
                attributes: att.attributes,
                categoryId: id,
            });
        });
    }

    private static response(res: Response) {
        return ResponseService.sendResWithData(res, 200, {
            data: "Category updated successfully",
        });
    }

    static async updateCategory(
        req: Request<{}, {}, UpdateCategorySchemaType>,
        res: Response,
        next: NextFunction
    ) {
        const {
            is_image_update,
            is_name_update,
            is_price_attributes_update,
            id,
            name,
            price_attributes,
        } = req.body;
        if (is_image_update) {
            let setImage: Function = () => {};

            if (is_name_update && !is_price_attributes_update) {
                // if only name should be updated
                setImage = async (result: UploadApiErrorResponse) => {
                    await CategoryUpdate.updateCategoryWithId(id, {
                        image: result?.url,
                        name,
                    });
                };
            } else if (is_price_attributes_update && !is_name_update) {
                // if only price_attributes should be updated
                setImage = async (result: UploadApiErrorResponse) => {
                    await CategoryUpdate.deleteAndCreateAttr(
                        id,
                        price_attributes
                    );
                    await CategoryUpdate.updateCategoryWithId(id, {
                        image: result?.url,
                    });
                };
            } else if (is_name_update && is_price_attributes_update) {
                // if price attributes and name both should be updated
                setImage = async (result: UploadApiErrorResponse) => {
                    await CategoryUpdate.deleteAndCreateAttr(
                        id,
                        price_attributes
                    );
                    await CategoryUpdate.updateCategoryWithId(id, {
                        image: result?.url,
                        name,
                    });
                };
            }

            const processedImage = await ImageService.compressImageToBuffer(
                req
            );
            ImageService.uploadImageWithBuffer(
                processedImage,
                async (error, result) => {
                    if (error) {
                        return next(
                            new ErrorResponse(
                                "Error while uploading image",
                                500
                            )
                        );
                    }
                    setImage(result);
                    CategoryUpdate.response(res);
                }
            );
            return;
        }
        if (is_name_update && !is_image_update) {
            await CategoryUpdate.updateCategoryWithId(id, { name });
        }
        if (is_price_attributes_update && !is_image_update) {
            await CategoryUpdate.deleteAndCreateAttr(id, price_attributes);
        }
        CategoryUpdate.response(res)
    }
}
export default CategoryUpdate;

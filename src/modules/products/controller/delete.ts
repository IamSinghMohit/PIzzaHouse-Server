import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "@/utils";
import {  ResponseService } from "@/services";
import { ProductModel } from "../models/product.model";
import { ProductPriceSectionModel } from "../models/productPriceSection.model.ts";
import { ProductDefaultPriceAttributModel } from "../models/productDefaultAttribute.model";
import mongoose from "mongoose";
import { AddToDeleteImageQueue } from "@/queue/deleteImage.queue";

class ProductDelete {
    static async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const product = await ProductModel.findOne({ _id: id });
        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            Promise.all([
                await ProductModel.deleteOne({ _id: id }, { session }),
                await ProductPriceSectionModel.deleteMany(
                    { product_id: id },
                    { session },
                ),
                await ProductDefaultPriceAttributModel.deleteOne(
                    {
                        product_id: id,
                    },
                    { session },
                ),
            ]);
            await session.commitTransaction();
            ResponseService.sendResponse(res, 200, true, "Product deleted");
            await AddToDeleteImageQueue({ tag: `productId:${product._id}` });
        } catch (error) {
            await session.abortTransaction();
            next(new ErrorResponse("Error while deleting product", 500));
        } finally {
            await session.endSession();
        }
    }
}
export default ProductDelete;

import { NextFunction, Request, Response } from "express";
import { TCreateOrderSchema } from "../schema/create";
import ProductService from "@/modules/products/service/product.service";
import { ErrorResponse } from "@/utils";
import TopingService from "@/modules/topings/topings.service";
import ProductPriceSectionService from "@/modules/products/service/productPriceSection";
import OrderServices from "../order.service";
import { OrderStatusEnum } from "../schema/main";
import { ImageService, ResponseService } from "@/services";
import { TToping } from "@/modules/topings/topings.model";
import { DocumentType } from "@typegoose/typegoose";

class OrderCreate {
    static async create(
        req: Request<{}, {}, TCreateOrderSchema>,
        res: Response,
        next: NextFunction,
    ) {
        const { topings, product_id, product_sections, price } = req.body;

        if (!product_sections) {
            return next(new ErrorResponse("Bad request", 400));
        }

        const product = await ProductService.find(
            { _id: product_id },
            "FINDONE",
        );
        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }
        const fetchedProductSections =
            await ProductPriceSectionService.findMany({
                product_id: product_id,
            });

        product_sections.forEach((sec) => {
            fetchedProductSections.forEach((fsec) => {
                if (sec.name === fsec.name) {
                    fsec.attributes.forEach((att) => {
                        if (sec.attribute === att.name) {
                            if (sec.value != att.value)
                                return next(
                                    new ErrorResponse("Invalid price", 422),
                                );
                        }
                    });
                }
            });
        });

        const promisedTopings = await Promise.allSettled(
            topings.map(async (top) => {
                return await TopingService.findToping({ _id: top }, "FINDONE");
            }),
        );
        const fetchedTopings = promisedTopings.filter(
            (res): res is PromiseFulfilledResult<DocumentType<TToping>> =>
                res.status === "fulfilled",
        );

        if (fetchedTopings.length != topings.length || !fetchedTopings) {
            return next(new ErrorResponse("Invalid topings", 400));
        }

        const CoudinaryOrderFolderName = `${process.env.CLOUDINARY_ORDER_FOLDER}`;
        const TopingArray = [];
        for (let toping of fetchedTopings) {
            const result = await ImageService.uploadWithUrl(
                toping.value.image,
                CoudinaryOrderFolderName,
            );
            TopingArray.push({
                name: toping.value.name,
                price: toping.value.price,
                image: result.url,
            });
        }

        const productImage = await ImageService.uploadWithUrl(
            product.image,
            CoudinaryOrderFolderName,
        );

        const order = await OrderServices.create({
            toping: TopingArray,
            price,
            product_image: productImage.url,
            status: OrderStatusEnum.PLACED,
            product_name: product.name,
            product_sections,
        });
        ResponseService.sendResponse(res, 200, true, order);
    }
}
export default OrderCreate;

import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../model/order";
import { ResponseService } from "@/services";
import OrderDto from "../order.dto";
import { ErrorResponse } from "@/utils";
import { TGetAdminOrders } from "../schema/read";
import { OrderStatusEnum } from "../schema/main";
import { BaseOrderDto, OrderTopingDto } from "../base.dto";
import { OrderTopings } from "../model/orderTopings";

class OrderRead {
    static async getOrdersAdmin(
        req: Request<{}, {}, {}, TGetAdminOrders>,
        res: Response,
        next: NextFunction,
    ) {
        const { limit, page } = req.query;
        const originalLimit = limit || 10;
        const originalPage = page || 1;
        const totalDocument = await OrderModel.estimatedDocumentCount();

        const orders = await OrderModel.find({
            status: { $ne: OrderStatusEnum.COMPLETED },
        })
            .limit(originalLimit)
            .skip((originalPage - 1) * originalLimit);

        ResponseService.sendResponse(res, 200, true, {
            orders: orders.map((order) => new OrderDto(order)),
            pages: Math.ceil(totalDocument / originalLimit),
            page: originalPage,
        });
    }

    static async getOrder(req: Request, res: Response, next: NextFunction) {
        const order = await OrderModel.findOne({ _id: req.params.id }).populate(
            "order_topings",
        );
        if (!order) {
            return next(new ErrorResponse("Order not found", 404));
        }
        ResponseService.sendResponse(
            res,
            200,
            true,
            new BaseOrderDto(
                order,
                order.order_topings.map((top) => new OrderTopingDto(top as OrderTopings)),
            ),
        );
    }
}
export default OrderRead;

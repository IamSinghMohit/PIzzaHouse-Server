import { NextFunction, Request, Response } from "express";
import { Order, OrderModel } from "../model/order";
import { ResponseService } from "@/services";
import OrderDto from "../order.dto";
import { ErrorResponse } from "@/utils";

class OrderRead {
    static async getOrdersAdmin(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const orders = await OrderModel.find();
        ResponseService.sendResponse(
            res,
            200,
            true,
            orders.map((order) => new OrderDto(order)),
        );
    }

    static async getOrder(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const order = await OrderModel.findOne({_id:req.params.id});
        if(!order){
            return next(new ErrorResponse("Order not found",404))
        }
        ResponseService.sendResponse(
            res,
            200,
            true,
            new OrderDto(order),
        );
    }
}
export default OrderRead;

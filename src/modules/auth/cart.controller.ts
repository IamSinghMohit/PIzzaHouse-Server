import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "@/middlewares";
import { CartModel } from "./models/cart.model";
import { Order } from "../order/model/order";
import { ResponseService } from "@/services";
import { CartDto } from "./dto/cart.dto";
import { TValidateParamsId } from "../schema";
import { Types } from "mongoose";
import { TPassportUserRes } from "@/lib/passport";

class CartController {
    private static wrapper = asyncHandler;
    static getProducts = this.wrapper(
        async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user as TPassportUserRes;
            const cart = await CartModel.findOne({ user_id: user.id }).populate(
                "orders",
            );

            ResponseService.sendResponse(
                res,
                200,
                true,
                cart?.orders.map((ord) => new CartDto(ord as Order)),
            );
        },
    );

    static deleteItem = this.wrapper(
        async (
            req: Request<TValidateParamsId>,
            res: Response,
            next: NextFunction,
        ) => {
            const { id } = req.params;
            const user = req.user as TPassportUserRes;
            await CartModel.findOneAndUpdate(
                { user_id: user.id },
                { $pull: { orders: id } },
            );
            ResponseService.sendResponse(
                res,
                200,
                true,
                "deleted successfully",
            );
        },
    );
}
export default CartController;

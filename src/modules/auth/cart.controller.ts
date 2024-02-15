import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "@/middlewares";
import UserDto from "./dto/user.dto";
import { CartModel } from "./models/cart.model";
import { Order } from "../order/model/order";
import { ResponseService } from "@/services";
import { CartDto } from "./dto/cart.dto";
import { TValidateParamsId } from "../schema";
import { Types } from "mongoose";

class CartController {
    private static wrapper = asyncHandler;
    static getProducts = this.wrapper(
        async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user as UserDto;
            const cart = await CartModel.findOne({ user_id: user.id }).populate("orders_ids");
            console.log(JSON.stringify(cart))
            ResponseService.sendResponse(
                res,
                200,
                true,
                cart?.orders_ids.map((ord) => new CartDto(ord as Order)),
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
            const user = req.user as UserDto;
            const cart = await CartModel.findOneAndUpdate(
                { user_id: user.id },
                { $pull: { orders_ids: new Types.ObjectId(id) } },
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

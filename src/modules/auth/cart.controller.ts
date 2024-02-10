import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "@/middlewares";
import UserDto from "./dto/user.dto";
import { CartModel } from "./models/cart.model";
import { OrderModel } from "../order/model/order";
import { ResponseService } from "@/services";
import { CartDto } from "./dto/cart.dto";

class CartController {
    private static wrapper = asyncHandler;
    static getProducts = this.wrapper(
        async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user as UserDto;
            const cart = await CartModel.findOne({ user_id: user.id });
            const orders = await OrderModel.find({
                _id: { $in: cart?.orders_ids },
            }).select("image price quantity name");

            ResponseService.sendResponse(
                res,
                200,
                true,
                orders.map((ord) => new CartDto(ord)),
            );
        },
    );
}
export default CartController;

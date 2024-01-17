import { asyncHandler } from "@/middlewares";
import OrderCreate from "./create";

class OrderController {
    private static wrapper = asyncHandler;
    static create = this.wrapper(OrderCreate.create);
}
export default OrderController;

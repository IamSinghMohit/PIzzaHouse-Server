import { asyncHandler } from "@/middlewares";
import OrderCreate from "./create";
import OrderUpdate from "./update";
import OrderRead from "./read";

class OrderController {
    private static wrapper = asyncHandler;
    static create = this.wrapper(OrderCreate.create);
    static updateOrderWebhook = OrderUpdate.OrderWebhook;
    static getOrdersForAdmin = this.wrapper(OrderRead.getOrdersAdmin);
    static getOrder = this.wrapper(OrderRead.getOrder)
    static upateOrderStatus = this.wrapper(OrderUpdate.orderStatus)
}
export default OrderController;

import Validator from "@/utils/validatorWrapper.";
import { CreateOrderSchema } from "./schema/create";
import { OrderStatusSchema } from "./schema/update";
import { OrderParamIdSchema } from "./schema/main";
import { TGetAdminOrders } from "./schema/read";

class OrderValidator {
    static create = Validator.ReqBody(CreateOrderSchema);
    static paramId = Validator.ReqParams(OrderParamIdSchema);
    static status = Validator.ReqBody(OrderStatusSchema);
    static adminOrders = Validator.ReqQuery(TGetAdminOrders);
    static getOrder = Validator.ReqParams(OrderParamIdSchema);
}
export default OrderValidator;

import Validator from "@/utils/validatorWrapper."
import { CreateOrderSchema } from "./schema/create"
class OrderValidator {
    static create = Validator.ReqBody(CreateOrderSchema)
}
export default OrderValidator

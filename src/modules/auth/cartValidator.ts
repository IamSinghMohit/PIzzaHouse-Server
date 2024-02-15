import Validator from "@/utils/validatorWrapper.";
import { ValidateParamsId } from "../schema";

class CartValidator {
    static deleteItem = Validator.ReqParams(ValidateParamsId);
}
export default CartValidator;

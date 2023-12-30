import Validator from "@/utils/validatorWrapper.";
import { CreateTopingSchema } from "./schema/create";
import { GetAllTopingsSchema, GetTopingWithCategorySchema } from "./schema/read";

class TopingValidator {
    static createToping = Validator.ReqBody(CreateTopingSchema, (req) => {
        return {
            ...req.body,
            price: parseInt(req.body.price),
        };
    });
    static GetTopingWithCategory = Validator.ReqParams(GetTopingWithCategorySchema)
    static getAllTopings = Validator.ReqParams(GetAllTopingsSchema)
}
export default TopingValidator;

import Validator from "@/utils/validatorWrapper.";
import { CreateTopingSchema } from "./schema/create";
import {
    GetAllTopingsSchema,
    GetTopingWithCategorySchema,
} from "./schema/read";
import { UpdateTopingSchema } from "./schema/update";

class TopingValidator {
    static createToping = Validator.ReqBody(CreateTopingSchema);
    static GetTopingWithCategory = Validator.ReqParams(
        GetTopingWithCategorySchema,
    );
    static getAllTopings = Validator.ReqQuery(GetAllTopingsSchema);
    static updateToping = Validator.ReqBody(UpdateTopingSchema)
}
export default TopingValidator;

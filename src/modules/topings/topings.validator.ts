import Validator from "@/utils/validatorWrapper.";
import { CreateTopingSchema } from "./schema/create";
import {
    GetAllTopingsSchema,
    GetTopingWithCategorySchema,
} from "./schema/read";
import { UpdateTopingSchema } from "./schema/update";
import { DeleteTopingSchema } from "./schema/delete";

class TopingValidator {
    static createToping = Validator.ReqBody(CreateTopingSchema, (req) => {
        return {
            ...req.body,
            categories: JSON.parse(req.body.categories_json),
        };
    });
    static GetTopingWithCategory = Validator.ReqParams(
        GetTopingWithCategorySchema,
    );
    static getAllTopings = Validator.ReqQuery(GetAllTopingsSchema);
    static updateToping = Validator.ReqBody(UpdateTopingSchema, (req) => {
        return {
            ...req.body,
            ...(req.body.categories_json
                ? { categories: JSON.parse(req.body.categories_json) }
                : {}),
        };
    });
    static deleteToping = Validator.ReqParams(DeleteTopingSchema);
}
export default TopingValidator;

import { CreateCategorySchema } from "./schema/create";
import { DeleteCategorySchema } from "./schema/delete";
import Validator from "@/utils/validatorWrapper.";
import {
    GetSectionsSchema,
    getCategoriesSchema,
    searchCategorySchema,
} from "./schema/read";
import { UpdateCategorySchema } from "./schema/update";

export class CategoryValidator {
    static createCategory = Validator.ReqBody(CreateCategorySchema, (req) => {
        return {
            name: req.body.name,
            sections: [...JSON.parse(req.body.json)],
        };
    });

    static deleteCategory = Validator.ReqParams(DeleteCategorySchema);

    static searchCategory = Validator.ReqQuery(searchCategorySchema);

    static getCategories = Validator.ReqQuery(getCategoriesSchema);

    static getSections = Validator.ReqParams(GetSectionsSchema);

    static updateCategory = Validator.ReqBody(UpdateCategorySchema);
}

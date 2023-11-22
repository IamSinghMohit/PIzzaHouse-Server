import { CreateCategorySchema } from "./schema/create";
import { deleteCategorySchema } from "./schema/delete";
import Validator from "@/utils/validatorWrapper.";
import {
    getAttributeSchema,
    getCategoriesSchema,
    searchCategorySchema,
} from "./schema/read";
import { UpdateCategorySchema } from "./schema/update";

export class CategoryValidator {
    static createCategory = Validator.ReqBody(CreateCategorySchema, (req) => {
        return {
            name: req.body.name,
            price_attributes: [...JSON.parse(req.body.json)],
        };
    });

    static deleteCategory = Validator.ReqParams(deleteCategorySchema);

    static searchCategory = Validator.ReqQuery(searchCategorySchema);

    static getCategories = Validator.ReqQuery(getCategoriesSchema);

    static getAttributes = Validator.ReqParams(getAttributeSchema);

    static updateCategory = Validator.ReqBody(UpdateCategorySchema, (req) => {
        return {
            id: req.body.id,
            name: req.body.name,
            price_attributes: [...JSON.parse(req.body.json)],
            is_name_update: req.body.is_name_update == "true",
            is_image_update: req.body.is_image_update == "true",
            is_price_attributes_update:
                req.body.is_price_attributes_update == "true",
        };
    });
}

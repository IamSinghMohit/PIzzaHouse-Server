import { CategoryType, CateogryModel } from "../models/category.model";
import CategoryDto from "../dto/category.dto";
type FindType = "FINDONE" | "FIND";

type test =  Record<keyof CategoryType, any>

class CategoryService {
    static async findCategory(
        obj: Partial<Record<keyof CategoryType, any>>,
        type: FindType
    ) {
        if (type == "FIND") {
            return await CateogryModel.find(obj).then((res) =>
                res.map((r) => new CategoryDto(r))
            );
        } else {
            return await CateogryModel.findOne(obj).then((res) => {
                if (res) {
                    return new CategoryDto(res);
                } else {
                    return null;
                }
            });
        }
    }

    static async createCategory(obj: CategoryType) {
        return await CateogryModel.create(obj);
    }

    static getInstance(opts: Partial<CategoryType>) {
        return new CateogryModel(opts);
    }

    static async updateCategoryById(id: string) {
        return await CateogryModel.findByIdAndUpdate(id);
    }

    static async deleteCategory(id: string) {
        return await CateogryModel.deleteOne({ _id: id });
    }
}
export default CategoryService;

import { CategoryType, CateogryModel } from "../models/category.model";
import CategoryDto from "../dto/category.dto";

type FindType = "FINDONE" | "FIND";
type CategoryGeneralType = Partial<
    Omit<CategoryType, "_id"> & {
        _id: string;
    }
>;

class CategoryService {
    static async findCategory<
        T extends FindType,
        Treturn = T extends "FINDONE"
            ? CategoryDto | null
            : CategoryDto[] | null
    >(
        obj: Partial<Record<keyof CategoryType, any>>,
        type: T
    ): Promise<Treturn> {
        if (type == "FIND") {
            return (await CateogryModel.find(obj).then((res) =>
                res.map((r) => new CategoryDto(r))
            )) as any;
        } else {
            return (await CateogryModel.findOne(obj).then((res) => {
                if (res) {
                    return new CategoryDto(res);
                } else {
                    return null;
                }
            })) as any;
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

    static async findOneAndUpdate(
        condition: CategoryGeneralType,
        update: Partial<CategoryType>
    ) {
        return await CateogryModel.findOneAndUpdate(condition, update, {
            new: true,
        });
    }

    static async count() {
        return await CateogryModel.estimatedDocumentCount();
    }

    static async findPaginatedCategory(
        obj: Partial<Record<keyof CategoryType, any>>,
        limitSkip: { limit: number; skip: number }
    ) {
        return await CateogryModel.find(obj)
            .limit(limitSkip.limit)
            .skip(limitSkip.skip)
            .then((res) => res.map((r) => new CategoryDto(r)));
    }

    static async searchCategory(
        nameString: string,
        limit: number,
        cursor?: string
    ) {
        return await CateogryModel.find({
            name: {
                // $regex: { nameString, $options: "i" },
                $regex: new RegExp(nameString, "i"),
            },
            ...(cursor ? { _id: { $lt: cursor } } : {}),
        })
            .sort({ _id: -1 })
            .limit(limit)
            .then((res) => res.map((r) => new CategoryDto(r)));
    }
}
export default CategoryService;

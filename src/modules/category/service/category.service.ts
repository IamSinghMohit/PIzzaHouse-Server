import { TCategory, CateogryModel } from "../models/category.model";
import { DocumentType } from "@typegoose/typegoose";

type Tfind = "FINDONE" | "FIND";
type options = Partial<TCategory>;

class CategoryService {
    static async find<
        T extends Tfind,
        Treturn = T extends "FINDONE"
            ? DocumentType<TCategory> | null
            : DocumentType<TCategory>[],
    >(obj: Partial<Record<keyof TCategory, any>>, type: T): Promise<Treturn> {
        if (type == "FIND") {
            return (await CateogryModel.find(obj)) as any;
        } else {
            return (await CateogryModel.findOne(obj)) as any;
        }
    }

    static async createCategory(opts: options) {
        return await CateogryModel.create(opts);
    }

    static getInstance(opts: options) {
        return new CateogryModel(opts);
    }

    static async updateCategoryById(id: string) {
        return await CateogryModel.findByIdAndUpdate(id);
    }
    static async delete(opts: options) {
        return await CateogryModel.deleteOne(opts);
    }

    static async findOneAndUpdate(condition: options, update: options) {
        return await CateogryModel.findOneAndUpdate(condition, update, {
            new: true,
        });
    }

    static async count() {
        return await CateogryModel.estimatedDocumentCount();
    }

    static async findPaginatedCategory(
        obj: Partial<Record<keyof TCategory, any>>,
        limitSkip: { limit: number; skip: number },
    ) {
        return await CateogryModel.find(obj)
            .limit(limitSkip.limit)
            .skip(limitSkip.skip);
    }

    static async searchCategory(
        nameString: string,
        limit: number,
        cursor?: string,
    ) {
        return await CateogryModel.find({
            name: {
                $regex: new RegExp(nameString, "i"),
            },
            ...(cursor ? { _id: { $lt: cursor } } : {}),
        })
            .sort({ _id: -1 })
            .limit(limit)
            .select("-__v");
    }
}
export default CategoryService;

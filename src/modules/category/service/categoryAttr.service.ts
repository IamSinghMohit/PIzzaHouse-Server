import { UpdateQuery } from "mongoose";
import {
    CategoryAttrModel,
    CategoryAttrType,
} from "../models/categoryAttr.model";
import CategoryAttrDto from "../dto/cateAttr.dto";

class CategoryAttrService {
    static async create(opt: Partial<CategoryAttrType>) {
        return await CategoryAttrModel.create(opt);
    }
    static async deleteMany(opt: Partial<CategoryAttrType>){
        return await CategoryAttrModel.deleteMany(opt)
    }

    static getInstance(opts: Partial<CategoryAttrType>) {
        return new CategoryAttrModel(opts);
    }

    static async getAttribute(opts: Partial<CategoryAttrType>) {
        return await CategoryAttrModel.find(opts).then((res) =>
            res.map((r) => new CategoryAttrDto(r))
        );
    }

    static async updateManyAttribute(
        criteria: Partial<CategoryAttrType>,
        dataToUpdate: UpdateQuery<
            Partial<Omit<CategoryAttrType, "_id" | "id" | "categoryId">>
        >
    ) {
        return await CategoryAttrModel.updateMany(criteria, dataToUpdate, {
            new: true,
        });
    }

    static async findOneAndUpdate(
        condition: Partial<CategoryAttrType>,
        dataToUpdate: Partial<CategoryAttrType>
    ) {
        return await CategoryAttrModel.findOneAndUpdate(
            condition,
            dataToUpdate,
            { new: true }
        );
    }

    static async deleteAttribute(id: string) {
        return await CategoryAttrModel.deleteMany({ categoryId: id });
    }
}
export default CategoryAttrService;

import { UpdateQuery } from "mongoose";
import {
    CategoryAttributeModel,
    CategoryAttributeType
} from "../models/categoryAttributes";
import CategoryAttrDto from "../dto/categoryAttribute.dto";

class CategoryAttributeService {
    static async create(opt: Partial<CategoryAttributeType>) {
        return await CategoryAttributeModel.create(opt);
    }
    static async deleteMany(opt: Partial<CategoryAttributeType>){
        return await CategoryAttributeModel.deleteMany(opt)
    }

    static getInstance(opts: Partial<CategoryAttributeType>) {
        return new CategoryAttributeModel(opts);
    }

    static async getAttribute(opts: Partial<CategoryAttributeType>) {
        return await CategoryAttributeModel.find(opts).then((res) =>
            res.map((r) => new CategoryAttrDto(r))
        );
    }

    static async updateManyAttribute(
        criteria: Partial<CategoryAttributeType>,
        dataToUpdate: UpdateQuery<
            Partial<Omit<CategoryAttributeType, "_id" | "id" | "categoryId">>
        >
    ) {
        return await CategoryAttributeModel.updateMany(criteria, dataToUpdate, {
            new: true,
        });
    }

    static async findOneAndUpdate(
        condition: Partial<CategoryAttributeType>,
        dataToUpdate: Partial<CategoryAttributeType>
    ) {
        return await CategoryAttributeModel.findOneAndUpdate(
            condition,
            dataToUpdate,
            { new: true }
        );
    }

    static async deleteAttribute(id: string) {
        return await CategoryAttributeModel.deleteMany({ categoryId: id });
    }
}
export default CategoryAttributeService 

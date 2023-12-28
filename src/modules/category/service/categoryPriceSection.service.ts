import { UpdateQuery } from "mongoose";
import {
    CategoryPriceSectionModel,
    TCategoryPriceSection,
} from "../models/categoryPriceSection";
import { DocumentType } from "@typegoose/typegoose";

type options = Partial<TCategoryPriceSection>;
type create = "ONE" | "MANY";

class CategoryPriceSectionService {
    static async create<
        T extends create,
        TReturn = T extends "ONE"
            ? DocumentType<TCategoryPriceSection>
            : DocumentType<TCategoryPriceSection>[]
    >({
        type,
        payload,
    }: {
        type: create;
        payload: options | options[];
    }): Promise<TReturn> {
        if (type == "ONE") {
            return (await CategoryPriceSectionModel.create(payload)) as any;
        } else {
            return (await CategoryPriceSectionModel.insertMany(payload)) as any;
        }
    }

    static async deleteMany(opt: options) {
        return await CategoryPriceSectionModel.deleteMany(opt);
    }

    static getInstance(opt: options) {
        return new CategoryPriceSectionModel(opt);
    }

    static async getSections(opt: options) {
        return await CategoryPriceSectionModel.find(opt).select(
            "-__v -category_id"
        );
    }

    static async updateManyAttribute(
        criteria: options,
        dataToUpdate: UpdateQuery<
            Partial<Omit<TCategoryPriceSection, "_id" | "id" | "categoryId">>
        >
    ) {
        return await CategoryPriceSectionModel.updateMany(
            criteria,
            dataToUpdate,
            {
                new: true,
            }
        );
    }

    static async findOneAndUpdate(condition: options, dataToUpdate: options) {
        return await CategoryPriceSectionModel.findOneAndUpdate(
            condition,
            dataToUpdate,
            { new: true }
        );
    }

}
export default CategoryPriceSectionService;

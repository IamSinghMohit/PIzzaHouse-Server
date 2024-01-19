import {
    DocumentType,
    getModelForClass,
    index,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@index({ name: 1 }, { unique: true })
@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Category extends TimeStamps {
    _id:string

    @prop({ required: true })
    name: string;

    @prop({ required: true })
    image: string;

    @prop({ required: true, type: [String] })
    sections: string[];
}

export const CategoryModel = getModelForClass(Category);

export type TCategory = Pick<
    DocumentType<Category>,
    "name" | "image" | "sections" | "createdAt" | "updatedAt" | "_id"
>;

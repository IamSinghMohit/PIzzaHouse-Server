import {
    DocumentType,
    getModelForClass,
    index,
    prop,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@index({name:1},{unique:true})
export class Category extends TimeStamps{
    @prop({ required: true })
    name: string;

    @prop({ required: true })
    image: string;

    @prop({ required: true, type: [String]})
    price_attributes: string[];
}

export const CateogryModel = getModelForClass(Category);

export type CategoryType = Pick<
    DocumentType<Category>,
    "name" | "image" | "price_attributes" | "createdAt" | "updatedAt" | "_id"
>


import {
    DocumentType,
    getModelForClass,
    prop,
    Ref,
} from "@typegoose/typegoose";
import { CategoryAttr } from "./categoryAttr.model";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class Category extends TimeStamps{
    @prop({ required: true })
    name: string;

    @prop({ required: true })
    image: string;

    @prop({ required: true, ref: () => CategoryAttr })
    price_attributesId: Ref<CategoryAttr["_id"]>[];
}

export const CateogryModel = getModelForClass(Category);

export type CategoryType = Pick<
    DocumentType<Category>,
    "name" | "image" | "price_attributesId" | "_id" | "createdAt" | "updatedAt"
>;

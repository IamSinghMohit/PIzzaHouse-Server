import {
    DocumentType,
    getModelForClass,
    prop,
    modelOptions,
} from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";

export interface Attributes {
    id: string;
    title: string;
}

export interface CategoryAttr extends Base {}
@modelOptions({options:{allowMixed:0}})
export class CategoryAttr {
    @prop({ required: true, type: String })
    attribute_title: string;

    @prop({ required: true, type:String})
    categoryId: string;

    @prop({ required: true, type: [Object] }) // Use type [Object] to store plain objects
    attributes: Attributes[];
}

export const CategoryAttrModel = getModelForClass(CategoryAttr );
export type CategoryAttrType = Pick<
    DocumentType<CategoryAttr>,
    "id" | "attribute_title" | "attributes" | "categoryId"|"_id"
>;
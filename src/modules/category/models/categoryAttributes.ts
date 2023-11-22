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

export interface CategoryAttribute extends Base {}
@modelOptions({ options: { allowMixed: 0 } })
export class CategoryAttribute {
    @prop({ required: true, type: String })
    attribute_title: string;

    @prop({ required: true, type: String })
    category_id: string;

    @prop({ required: true, type: [Object] }) // Use type [Object] to store plain objects
    attributes: Attributes[];
}

export const CategoryAttributeModel = getModelForClass(CategoryAttribute);
export type CategoryAttributeType = Pick<
    DocumentType<CategoryAttribute>,
    "id" | "attribute_title" | "attributes" | "category_id" | "_id"
>;

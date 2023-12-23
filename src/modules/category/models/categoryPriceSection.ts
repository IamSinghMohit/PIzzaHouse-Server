import {
    DocumentType,
    getModelForClass,
    prop,
    modelOptions,
    index,
} from "@typegoose/typegoose";

export interface Attributes {
    id: string;
    name: string;
}

@modelOptions({ options: { allowMixed: 0 } })
@index({ category_id: 1 })
export class CategoryPriceSection {
    _id:string;

    @prop({ required: true, type: String })
    name: string;

    @prop({ required: true, type: String })
    category_id: string;

    @prop({ required: true, type: [Object] }) // Use type [Object] to store plain objects
    attributes: Attributes[];
}

export const CategoryPriceSectionModel = getModelForClass(CategoryPriceSection);

export type TCategoryPriceSection = Pick<
    DocumentType<CategoryPriceSection>,
    "id" | "name" | "attributes" | "category_id" | "_id"
>;

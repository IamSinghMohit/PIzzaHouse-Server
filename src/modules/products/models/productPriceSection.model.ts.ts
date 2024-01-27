import {
    DocumentType,
    getModelForClass,
    prop,
    modelOptions,
} from "@typegoose/typegoose";
import { TProductAttributeSchema } from "../schema/main";

@modelOptions({ options: { allowMixed: 0 } })
export class ProductPriceSection {
    _id: string;

    @prop({ required: true, type: String })
    category: string;

    @prop({ required: true, type: String })
    name: string;

    @prop({ required: true, type: [Object] })
    attributes: TProductAttributeSchema ;
}

export const ProductPriceSectionModel = getModelForClass(ProductPriceSection);
export type TProductPriceSection= Pick<
    DocumentType<ProductPriceSection>,
    "_id" | "name" | "attributes" | "category" 
>;

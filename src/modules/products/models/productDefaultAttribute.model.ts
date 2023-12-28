import {
    DocumentType,
    getModelForClass,
    prop,
    modelOptions,
} from "@typegoose/typegoose";
import { TProductDefaultAttributeSchema } from "../schema/main";

@modelOptions({ options: { allowMixed: 0 } })
export class ProductDefaultPriceAttributes {
    _id: string;

    @prop({ required: true, type: String })
    category: string;

    @prop({ required: true, type: String })
    product_id: string;

    @prop({ required: true, type: Array })
    attributes: TProductDefaultAttributeSchema['default_attributes'];
}

export const ProductDefaultPriceAttributModel = getModelForClass(
    ProductDefaultPriceAttributes
);
export type TProductDefaultPriceAttribute = Pick<
    DocumentType<ProductDefaultPriceAttributes>,
    "_id" | "attributes" | "category" | "product_id"
>;

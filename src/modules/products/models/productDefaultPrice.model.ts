import {
    DocumentType,
    getModelForClass,
    prop,
    modelOptions,
} from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";

export interface ProductDefaultPrice extends Base {}
@modelOptions({ options: { allowMixed: 0 } })
export class ProductDefaultPrice {
    @prop({ required: true, type: String })
    category: string;

    @prop({ required: true, type: Object })
    default_prices: Record<string, string>;
}

export const ProductDefaultPriceModel = getModelForClass(ProductDefaultPrice);
export type ProductDefaultPriceType = Pick<
    DocumentType<ProductDefaultPrice>,
    "_id" | "category" | "default_prices"
>;

import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop,
    Ref,
    index,
    pre,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ProductStatusEnum } from "../schema/main";
import { ProductAttribute } from "./productAttribute.model.ts";
import { ProductDefaultPrice } from "./productDefaultPrice.model";

export interface Product extends Base {}
@modelOptions({ options: { allowMixed: 0 } })
@index({name:1},{unique:true})
export class Product extends TimeStamps {
    @prop({ required: true, type: String })
    name: string;

    @prop({ required: true, type: String })
    image: string;

    @prop({ required: true, type: String })
    category: string;

    @prop({ required: true, type: String })
    description: string;

    @prop({ required: true, enum: ProductStatusEnum, default: "published" })
    status: ProductStatusEnum;

    @prop({ required: true, type: Number })
    price: number;

    @prop({ required: true, type: Boolean, default: false })
    featured: boolean;

    @prop({ required: true, ref:() => ProductAttribute })
    price_attributes: Ref<ProductAttribute>[] ;

    @prop({ required: true, ref:() =>ProductDefaultPrice })
    default_prices: Ref<ProductDefaultPrice >;
}

export const ProductModel = getModelForClass(Product);
export type ProductType = Pick<
    DocumentType<Product>,
    | "name"
    | "category"
    | "price_attributes"
    | "createdAt"
    | "updatedAt"
    | "_id"
    | "status"
    | "price"
    | "description"
    | "default_prices"
    | "featured"
    | "image"
>;

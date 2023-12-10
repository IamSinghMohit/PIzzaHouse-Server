import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop,
    index,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ProductStatusEnum } from "../schema/main";

@modelOptions({
    options: { allowMixed: 0 },
    schemaOptions: {
        timestamps: true,
    },
})
@index({ name: 1 }, { unique: true })
export class Product extends TimeStamps{
    _id:string

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

    @prop({ required: true, type: [String] })
    price_attributes: string[];

    @prop({ required: true, type: String })
    default_prices: string;
}

export const ProductModel = getModelForClass(Product);
export type TProduct = Pick<
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

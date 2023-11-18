import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop,
    Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ProductAttr } from "./productAtt.model";
import { ProductStatusEnum } from "../schema/main";

@modelOptions({ options: { allowMixed: 0 } })
class Product extends TimeStamps {
    @prop({ required: true ,type:String})
    name: string;

    @prop({ required: true ,type:String})
    image: string;

    @prop({ required: true ,type:String})
    category: string;

    @prop({ required: true ,type:String})
    description: string;

    @prop({ required: true, enum: ProductStatusEnum, default: "published" })
    status: ProductStatusEnum;

    @prop({ required: true, type:Boolean,default:false})
    featured:boolean;

    @prop({ required: true, ref: () => ProductAttr })
    price_attributesId: Ref<ProductAttr["_id"]>[];
}

export const ProductModel = getModelForClass(Product);
export type ProductType = Pick<
    DocumentType<Product>,
    | "name"
    | "category"
    | "price_attributesId"
    | "createdAt"
    | "updatedAt"
    | '_id'
    |'status'
    | 'description'
>;

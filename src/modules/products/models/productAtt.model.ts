import {
    DocumentType,
    getModelForClass,
    prop,
    modelOptions,
} from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { ProductAttributeSchemaType } from "../schema/main";

export interface ProductAttr extends Base {}
@modelOptions({ options: { allowMixed: 0 } })
export class ProductAttr {
    @prop({ required: true, type: String })
    attribute_title: string;

    @prop({ required: true, type: [Object] })
    attributes: ProductAttributeSchemaType 
}

export const ProductAttrModel = getModelForClass(ProductAttr);
export type ProductAttrType = Pick<
    DocumentType<ProductAttr>,
    "_id" | "attribute_title" | "attributes"
>;

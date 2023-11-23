import {
    DocumentType,
    getModelForClass,
    prop,
    modelOptions,
} from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { ProductSubAttributeSchemaType } from "../schema/main";

export interface ProductAttribute extends Base {}
@modelOptions({ options: { allowMixed: 0 } })
export class ProductAttribute {
    @prop({ required: true, type: String })
    attribute_title: string;

    @prop({ required: true, type: [Object] })
    attributes: ProductSubAttributeSchemaType;
}

export const ProductAttributeModel = getModelForClass(ProductAttribute);
export type ProductAttributeType = Pick<
    DocumentType<ProductAttribute>,
    "_id" | "attribute_title" | "attributes"
>;

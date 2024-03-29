import { StatusEnum } from "@/modules/schema";
import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop,
    index,
    plugin
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";

@plugin(SpeedGooseCacheAutoCleaner)
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

    @prop({ required: true, enum: StatusEnum, default: "Published" })
    status:  StatusEnum;

    @prop({ required: true, type: Number })
    price: number;

    @prop({ required: true, type: Boolean, default: false })
    featured: boolean;

    @prop({ required: true, type: [String] })
    sections: string[];

    @prop({ required: true, type: String })
    default_attribute: string;
}

export const ProductModel = getModelForClass(Product);
export type TProduct = Pick<
    DocumentType<Product>,
    | "name"
    | "category"
    | "sections"
    | "createdAt"
    | "updatedAt"
    | "_id"
    | "status"
    | "price"
    | "description"
    | "default_attribute"
    | "featured"
    | "image"
>;

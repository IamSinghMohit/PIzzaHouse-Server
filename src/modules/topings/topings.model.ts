import {
    getModelForClass,
    prop,
    DocumentType,
    index,
    modelOptions,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { StatusEnum } from "../schema";

@index({ category: 1 })
@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Toping extends TimeStamps {
    _id: string;

    @prop({ required: true, type: String })
    name: string;

    @prop({ required: true })
    image: string;

    @prop({ required: true, type: Number })
    price: number;

    @prop({ required: true, enum:  StatusEnum, default: "Draft" })
    status: StatusEnum;

    @prop({ required: true, type: String })
    category: string;
}

export const TopingModel = getModelForClass(Toping);
export type TToping = Pick<
    DocumentType<Toping>,
    | "name"
    | "image"
    | "category"
    | "_id"
    | "price"
    | "status"
    | "createdAt"
    | "updatedAt"
>;

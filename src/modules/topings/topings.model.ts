import {
    getModelForClass,
    prop,
    DocumentType,
    modelOptions,
    plugin,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { StatusEnum } from "../schema";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";

@plugin(SpeedGooseCacheAutoCleaner)
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

    @prop({ required: true, enum:  StatusEnum, default: StatusEnum.DRAFT})
    status: StatusEnum;

    @prop({ required: true, type: [String] ,default:[]})
    categories: string[];
}

export const TopingModel = getModelForClass(Toping);
export type TToping = Pick<
    DocumentType<Toping>,
    | "name"
    | "image"
    | "categories"
    | "_id"
    | "price"
    | "status"
    | "createdAt"
    | "updatedAt"
>;

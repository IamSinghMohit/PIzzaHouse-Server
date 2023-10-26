import { getModelForClass, prop, DocumentType } from "@typegoose/typegoose";

export class Topings {
    @prop({ required: true, type: String })
    name: string;

    @prop({ required: true })
    image: string;

    @prop({ required: true, type: Number })
    price: number;

    @prop({ required: true, type: String })
    category: string;
}

export const TopingsModel = getModelForClass(Topings);
export interface TopingsType
    extends Pick<
        DocumentType<Topings>,
        "name" | "image" | "category" | "_id" | "price"
    > {}

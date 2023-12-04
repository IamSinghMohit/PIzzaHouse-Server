import { getModelForClass, prop, DocumentType, index } from "@typegoose/typegoose";

@index({category:1})
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

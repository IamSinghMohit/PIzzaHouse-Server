import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

// @modelOptions({
//     schemaOptions: {
//         versionKey: false,
//         timestamps: false,
//     },
// });
export class OrderTopings {
    _id:string;

    @prop({ type: String, required: true })
    name: string;

    @prop({ type: String, required: true })
    image: string;

    @prop({ type: Number, required: true })
    price: number;
}
export const OrderTopingModel = getModelForClass(OrderTopings);

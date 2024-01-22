import {
    getModelForClass,
    prop,
    modelOptions,
    DocumentType,
} from "@typegoose/typegoose";
import { OrderStatusEnum } from "../schema/main";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({
    options: { allowMixed: 0 },
    schemaOptions: {
        timestamps: true,
        versionKey: false,
    },
})
export class Order extends TimeStamps {
    _id: string;

    @prop({ required: true, type: String })
    user_full_name: string;

    @prop({ required: true, type: String })
    image: string;

    @prop({ required: true, type: String })
    address: string;

    @prop({ required: true, type: String })
    city: string;

    @prop({ required: true, type: String })
    state: string;

    @prop({ required: true, type: Number })
    price: number;

    @prop({ required: true, type: Number })
    quantity: number;

    @prop({ required: true, enum: OrderStatusEnum, default: "placed" })
    status: OrderStatusEnum;
}
export const OrderModel = getModelForClass(Order);

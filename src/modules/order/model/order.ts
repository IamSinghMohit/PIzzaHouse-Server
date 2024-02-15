import {
    getModelForClass,
    prop,
    modelOptions,
    Ref,
} from "@typegoose/typegoose";
import { OrderStatusEnum } from "../schema/main";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { OrderTopings } from "./orderTopings";

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
    name: string;

    @prop({ required: true, type: String })
    user_full_name: string;

    @prop({ required: true, type: String })
    image: string;

    @prop({ required: true, type: String })
    address: string;

    @prop({ required: true, type: String })
    description: string;

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

    @prop({ required: true, ref:() => OrderTopings})
    order_topings:Ref<OrderTopings>[]
}
export const OrderModel = getModelForClass(Order);

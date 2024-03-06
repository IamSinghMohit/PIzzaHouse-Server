import {
    getModelForClass,
    prop,
    modelOptions,
    Ref,
    plugin
} from "@typegoose/typegoose";
import { OrderStatusEnum } from "../schema/main";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { OrderTopings } from "./orderTopings";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";

@plugin(SpeedGooseCacheAutoCleaner)
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

    @prop({ required: false, type: String })
    user_full_name?: string;

    @prop({ required: true, type: String })
    image: string;

    @prop({ required: false, type: String })
    address?: string;

    @prop({ required: true, type: String })
    description: string;

    @prop({ required: false, type: String })
    city?: string;

    @prop({ required: false, type: String })
    state?: string;

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

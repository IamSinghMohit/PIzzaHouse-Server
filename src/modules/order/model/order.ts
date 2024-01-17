import { getModelForClass, prop ,modelOptions} from "@typegoose/typegoose";
import {
    OrderStatusEnum,
} from "../schema/main";

@modelOptions({
    options: { allowMixed: 0 },
    schemaOptions: {
        timestamps: true,
    },
})
export class Order {
    _id: string;

    @prop({ required: false, type: String })
    user_full_name: string;

    @prop({ required: false, type: String })
    user_id:string;

    @prop({ required: false, type: String })
    image: string;

    @prop({ required: false, type: String })
    adress: string;

    @prop({ required: false, type: Number })
    price: number;

    @prop({ required: true, type: Number })
    quantity: number;

    @prop({ required: true, enum: OrderStatusEnum, default: "placed" })
    status: OrderStatusEnum;
}
export const OrderModel = getModelForClass(Order);
// export type TOrderModel = Pick<
//     DocumentType<Order>,
//     "_id" | "price" | "status" | "user_full_name" | "adress" | "user_id" | "quantity"
// >;


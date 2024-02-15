import { Order } from "@/modules/order/model/order";
import {
    DocumentType,
    Ref,
    getModelForClass,
    prop,
} from "@typegoose/typegoose";

class Cart {
    _id: string;

    @prop({ required: true, type: String })
    user_id: string;

    @prop({ ref: () => Order })
    orders_ids: Ref<Order>[];
}

export const CartModel = getModelForClass(Cart);
export type TCart = Pick<DocumentType<Cart>, "_id" | "user_id" | "orders_ids">;

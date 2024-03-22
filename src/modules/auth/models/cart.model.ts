import { Order } from "@/modules/order/model/order";
import {
    DocumentType,
    Ref,
    getModelForClass,
    prop,
    plugin,
} from "@typegoose/typegoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";

@plugin(SpeedGooseCacheAutoCleaner)
class Cart {
    _id: string;

    @prop({ required: true, type: String })
    user_id: string;

    @prop({ ref: () => Order })
    orders: Ref<Order>[];
}

export const CartModel = getModelForClass(Cart);
export type TCart = Pick<DocumentType<Cart>, "_id" | "user_id" | "orders">;

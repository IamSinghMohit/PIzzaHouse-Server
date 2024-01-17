import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";

class Cart {
    _id: string;

    @prop({ required: false, type: String })
    user_id: string;

    @prop({ type: Array, default: [] })
    orders: [];
}

export const CartModel = getModelForClass(Cart);
export type TCart = Pick<DocumentType<Cart>, "_id" | "user_id" | "orders">;

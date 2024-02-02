import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";

class Cart {
    _id: string;

    @prop({ required: true, type: String })
    user_id: string;

    @prop({ type: [String], default: [] })
    orders_ids: string[];
}

export const CartModel = getModelForClass(Cart);
export type TCart = Pick<DocumentType<Cart>, "_id" | "user_id" | "orders_ids">;

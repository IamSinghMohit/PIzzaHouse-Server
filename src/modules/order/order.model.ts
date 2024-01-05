import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import {
    OrderStatusEnum,
    TOrderProductSectionsSchema,
    TOrderTopingSchema,
} from "./schema/main";

export class Order {
    _id: string;

    @prop({ required: true, type: String })
    product_name: string;

    @prop({ required: true, type: String })
    product_image: string;

    @prop({ required: true, type: String })
    user_id: string;

    @prop({ required: true, type: Number })
    price: number;

    @prop({ required: true, type: Array })
    toping: TOrderTopingSchema["topings"];

    @prop({ required: true, type: Array })
    product_sections: TOrderProductSectionsSchema["product_sections"];

    @prop({ required: true, enum: OrderStatusEnum, default: "placed" })
    status: OrderStatusEnum;
}
export const OrderModel = getModelForClass(Order);
export type TOrderModel = Pick<
    DocumentType<Order>,
    "_id" | "product_name" | "price" | "product_sections" | "status" | 'toping' |'user_id'|'product_image'
>;

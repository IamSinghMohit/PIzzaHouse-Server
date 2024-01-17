import { getModelForClass, prop ,modelOptions} from "@typegoose/typegoose";
import { TOrderTopingSchema } from "../schema/main";

export type TOrderProductSections = {
    name: string;
    attribute_name: string;
    value: number;
}[];

@modelOptions({
    options: { allowMixed: 0 },
    schemaOptions: {
        timestamps: true,
    },
})
class OrderDetails {
    _id: string;

    @prop({ required: true, type: String })
    product_name: string;

    @prop({ required: true, type: Array })
    toping: TOrderTopingSchema["topings"];

    @prop({ required: true, type: Array })
    product_sections: TOrderProductSections ;
}
export default OrderDetails;
export const OrderDetailsModel = getModelForClass(OrderDetails)
// export type TOrderDetails = Pick<DocumentType<typeof OrderDetails>,"_id" | "product_name">

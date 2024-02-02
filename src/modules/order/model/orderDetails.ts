import { getModelForClass, prop ,modelOptions} from "@typegoose/typegoose";
import { TOrderTopingSchema } from "../schema/main";

export type TOrderProductSections = {
    name: string;
    attribute: string;
    value: number;
}[];

@modelOptions({
    options: { allowMixed: 0 },
    schemaOptions: {
        timestamps: true,
        versionKey:false
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

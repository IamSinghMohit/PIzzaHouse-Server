import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { Topings } from "./topings";


export class Order{
    @prop({required:true})
    productId:string;
    
    @prop({ref:() => Topings  })
    topings:Ref<Topings>[];
}
export const OrderModel = getModelForClass(Order)
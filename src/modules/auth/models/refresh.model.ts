import { getModelForClass, prop } from "@typegoose/typegoose";

class Refresh  {
    @prop({required:true})
    token:string;
    @prop({required:true,unique:true})
    userId:string;
}
export const  RefreshModel = getModelForClass(Refresh)
import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        versionKey: false,
    },
})
class Refresh {
    @prop({ required: true })
    token: string;

    @prop({ required: true, unique: true })
    user_id: string;
}
export const RefreshModel = getModelForClass(Refresh);

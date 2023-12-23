import {
    DocumentType,
    getModelForClass,
    index,
    modelOptions,
    prop,
} from "@typegoose/typegoose";

@index({ title: 1 }, { unique: true })
@modelOptions({
    options: {
        allowMixed: 0,
    },
})
export class Util{
    _id: string;

    @prop({ required: true })
    title: string;

    @prop({ required: true, type: Object })
    data: Record<string, any>;
}

export const UtilModel = getModelForClass(Util);

export type TUtil = Pick<DocumentType<Util>, "title" | "_id" | "data">;

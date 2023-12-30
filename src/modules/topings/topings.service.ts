import { TopingModel, TToping } from "./topings.model";
import { DocumentType } from "@typegoose/typegoose";

type FindType = "FINDONE" | "FIND";
type Toptions = Partial<TToping>;
class TopingService {
    static async findToping<
        T extends FindType,
        Treturn = T extends "FINDONE"
            ? DocumentType<TToping> | null
            : DocumentType<TToping>[] | null,
    >(obj: Partial<Record<keyof TToping, any>>, type: T): Promise<Treturn> {
        if (type == "FIND") {
            return (await TopingModel.find(obj)) as any;
        } else {
            return (await TopingModel.findOne(obj)) as any;
        }
    }

    static async create(opts: Toptions) {
        return await TopingModel.create(opts);
    }

    static getInstance(opts: Toptions) {
        return new TopingModel(opts);
    }
    static async delete(opts: Toptions) {
        return await TopingModel.deleteOne(opts);
    }
    static async count() {
        return await TopingModel.estimatedDocumentCount();
    }
    static async getMaxPrice() {
        const doc = await TopingModel.find().sort({ price: -1 }).limit(1)
        return doc[0].price
    }

    static async findPaginatedTopings(
        obj: Partial<Record<keyof TToping, any>>,
        limitSkip: { limit: number; skip: number },
    ) {
        return await TopingModel.find(obj)
            .limit(limitSkip.limit)
            .skip(limitSkip.skip);
    }
}
export default TopingService;

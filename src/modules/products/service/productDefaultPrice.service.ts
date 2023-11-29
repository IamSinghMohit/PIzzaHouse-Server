import ProductDefaultPriceDto from "../dto/productDefaultPrice.dto";
import {
    ProductDefaultPriceModel,
    ProductDefaultPriceType,
} from "../models/productDefaultPrice.model";

type FindType = "FINDONE" | "FIND";
type opts = Partial<ProductDefaultPriceType>;

class ProductDefaultPriceSerivice {
    static async find<
        T extends FindType,
        Treturn = T extends "FINDONE"
            ? ProductDefaultPriceDto | null
            : ProductDefaultPriceDto[] | null
    >(obj: opts, type: T): Promise<Treturn> {
        if (type == "FIND") {
            return (await ProductDefaultPriceModel.find(obj).then((res) =>
                res.map((r) => new ProductDefaultPriceDto(r))
            )) as any;
        } else {
            return (await ProductDefaultPriceModel.findOne(obj).then((res) => {
                if (res) {
                    return new ProductDefaultPriceDto(res);
                } else {
                    return null;
                }
            })) as any;
        }
    }
    static getInstance(opts: opts) {
        return new ProductDefaultPriceModel(opts);
    }
    static async create(opts: opts) {
        return await ProductDefaultPriceModel.create(opts);
    }
    static async deleteOne(opts: opts) {
        return await ProductDefaultPriceModel.deleteOne(opts);
    }
}
export default ProductDefaultPriceSerivice;

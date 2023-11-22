import ProductAttributeDto from "../dto/attributes.dto";
import {
    ProductAttributeModel,
    ProductAttributeType,
} from "../models/productAttribute.model.ts";
type opts = Partial<ProductAttributeType>;

type FindType = "FINDONE" | "FIND";

class ProductAttributeService {
    static async find<
        T extends FindType,
        Treturn = T extends "FINDONE"
            ? ProductAttributeDto | null
            : ProductAttributeDto[] | null
    >(opts: opts, type: T): Promise<Treturn> {
        if (type == "FIND") {
            return (await ProductAttributeModel.find(opts).then((res) =>
                res.map((r) => new ProductAttributeDto(r))
            )) as any;
        } else {
            return (await ProductAttributeModel.findOne(opts).then((res) => {
                if (res) {
                    return new ProductAttributeDto(res);
                } else {
                    return null;
                }
            })) as any;
        }
    }
    static async createProductAttr(opts: opts) {
        return await ProductAttributeModel.create(opts);
    }

    static getInstance(opts: opts) {
        return new ProductAttributeModel(opts);
    }
    static async deleteMany(opts: opts) {
        return await ProductAttributeModel.deleteMany(opts);
    }
}
export default ProductAttributeService;

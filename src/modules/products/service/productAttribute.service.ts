import ProductAttributeDto from "../dto/attributes.dto";
import {
    ProductAttributeModel,
    ProductAttributeType,
} from "../models/productAttribute.model.ts";
type opts = Partial<ProductAttributeType>;

type FindType = "FINDONE" | "FIND";

class ProductAttributeService {
    static async findMany(opts: opts) {
        return await ProductAttributeModel.find(opts).then((res) =>
            res.map((r) => new ProductAttributeDto(r))
        );
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

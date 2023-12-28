import {
    TProductPriceSection,
    ProductPriceSectionModel,
} from "../models/productPriceSection.model.ts";

type opts = Partial<TProductPriceSection>;


class ProductPriceSectionService {
    static async findMany(opts: opts) {
        return await ProductPriceSectionModel.find(opts).select("-__v -category -produt_id")
    }
    static async create(opts: opts) {
        return await ProductPriceSectionModel.create(opts);
    }

    static getInstance(opts: opts) {
        return new ProductPriceSectionModel(opts);
    }
    static async deleteMany(opts: opts) {
        return await ProductPriceSectionModel.deleteMany(opts);
    }
}
export default ProductPriceSectionService ;

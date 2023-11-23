import { ProductDto } from "../dto/product.dto";
import { ProductModel, ProductType } from "../models/product.model";

type opts = Partial<ProductType>;
type FindType = "FINDONE" | "FIND";

class ProductService {
    static async find<
        T extends FindType,
        Treturn = T extends "FINDONE" ? ProductDto | null : ProductDto[] | null
    >(
        opts: Partial<Record<keyof ProductType, any>>,
        type: T
    ): Promise<Treturn> {
        if (type == "FIND") {
            return (await ProductModel.find(opts).then((res) =>
                res.map((r) => new ProductDto(r))
            )) as any;
        } else {
            return await ProductModel.findOne(opts).then((res) => {
                if (res) {
                    return new ProductDto(res) as any;
                } else {
                    return null;
                }
            });
        }
    }

    static async UpdateMany(condition: opts, updatedData: any): Promise<any> {
        await ProductModel.updateMany(condition, updatedData, {
            new: true,
        });
    }

    static async createProdut(opts: opts) {
        return await ProductModel.create(opts);
    }

    static getInstance(opts: opts) {
        return new ProductModel(opts);
    }
    static async count() {
        return await ProductModel.estimatedDocumentCount();
    }
}
export default ProductService;

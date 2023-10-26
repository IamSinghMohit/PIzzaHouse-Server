import { ProductDto } from "../dto/product.dto";
import { ProductModel, ProductType } from "../models/product.model";

type FindType = "FINDONE" | "FIND";

class ProductService {

    static async findProduct(opts: Partial<ProductType>, type: FindType) {
        if (type == "FIND") {
            return await ProductModel.find(opts).then((res) =>
                res.map((r) => new ProductDto(r))
            );
        } else {
            return await ProductModel.findOne(opts).then((res) => {
                if (res) {
                    return new ProductDto(res);
                } else {
                    return null;
                }
            });
        }
    }

    static async UpdateMany(condition: Partial<ProductType>,updatedData: Partial<ProductType>){
        return await ProductModel.updateMany(condition,updatedData)
    }

    static async createProdut(opts: Partial<ProductType>) {
        return await ProductModel.create(opts);
    }

    static getInstance(opts: Partial<ProductType>) {
        return new ProductModel(opts);
    }
    
}
export default ProductService;

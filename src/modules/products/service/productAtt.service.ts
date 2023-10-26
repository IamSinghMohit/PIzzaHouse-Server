import { ProductAttrModel,ProductAttrType } from "../models/productAtt.model";

class ProductAttrService {

    static async createProductAttr(opts:Partial<ProductAttrType>){
        return await ProductAttrModel.create(opts) 
    }

    static getInstance(opts:Partial<ProductAttrType>){
        return  new  ProductAttrModel(opts)
    }
}
export default ProductAttrService 
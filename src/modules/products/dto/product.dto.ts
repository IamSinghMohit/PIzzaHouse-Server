import { ProductType } from "../models/product.model";

export class ProductDto {
    id;
    name;
    category;
    price;
    description;
    status;
    price_attributesId;
    constructor(product: ProductType) {
        this.id = product._id;
        this.name = product.name;
        this.category = product.category;
        this.price = product.price;
        this.status = product.status;
        this.description = product.description;
        this.price_attributesId = product.price_attributesId;
    }
}

import { ProductType } from "../models/product.model";

export class ProductDto {
    id;
    name;
    category;
    description;
    status;
    price_attributes_id;
    default_prices_id;
    price;
    created_at;
    updated_at;
    featured;
    image;
    constructor(product: ProductType) {
        this.id = product._id;
        this.name = product.name;
        this.category = product.category;
        this.status = product.status;
        this.description = product.description;
        this.price_attributes_id = product.price_attributes_id;
        this.default_prices_id = product.default_prices_id;
        this.price = product.price;
        this.created_at = product.createdAt;
        this.updated_at = product.updatedAt;
        this.featured = product.featured;
        this.image = product.image
    }
}

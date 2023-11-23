import { ProductType } from "../models/product.model";

export class ProductDto {
    id;
    name;
    category;
    description;
    status;
    price_attributes;
    default_prices;
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
        this.price_attributes = product.price_attributes;
        this.default_prices = product.default_prices;
        this.price = product.price;
        this.created_at = product.createdAt;
        this.updated_at = product.updatedAt;
        this.featured = product.featured;
        this.image = product.image;
    }
}

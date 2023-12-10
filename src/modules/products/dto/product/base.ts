import { TProduct } from "../../models/product.model";

class BaseProductDto {
    id;
    name;
    category;
    description;
    price_attributes;
    default_prices;
    price;
    image;
    constructor(product: TProduct) {
        this.id = product._id;
        this.name = product.name;
        this.category = product.category;
        this.description = product.description;
        this.price_attributes = product.price_attributes;
        this.default_prices = product.default_prices;
        this.price = product.price;
        this.image = product.image;
    }
}
export default BaseProductDto;

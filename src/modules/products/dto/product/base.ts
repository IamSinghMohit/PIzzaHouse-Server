import { TProduct } from "../../models/product.model";

class BaseProductDto {
    id;
    name;
    category;
    description;
    sections;
    default_attributes;
    price;
    image;
    constructor(product: TProduct) {
        this.id = product._id;
        this.name = product.name;
        this.category = product.category;
        this.description = product.description;
        this.sections = product.sections;
        this.default_attributes = product.default_attribute;
        this.price = product.price;
        this.image = product.image;
    }
}
export default BaseProductDto;

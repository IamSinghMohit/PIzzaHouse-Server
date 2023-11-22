import { ProductAttributeType } from "../models/productAttribute.model.ts";

class ProductAttributeDto {
    attribute_title;
    attributes;
    constructor(attribute:ProductAttributeType ) {
        this.attribute_title = attribute.attribute_title;
        this.attributes = attribute.attributes;
    }
}
export default ProductAttributeDto;

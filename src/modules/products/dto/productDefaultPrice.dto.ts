import { TProductDefaultPriceAttribute } from "../models/productDefaultAttribute.model";
class ProductDefaultPriceDto {
    default_prices;
    constructor(dprice: TProductDefaultPriceAttribute) {
        this.default_prices = dprice.attributes;
    }
}
export default ProductDefaultPriceDto;

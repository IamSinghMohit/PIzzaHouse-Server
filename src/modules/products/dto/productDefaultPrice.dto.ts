import { ProductDefaultPriceType } from "../models/productDefaultPrice.model";

class ProductDefaultPriceDto {
    category;
    default_prices;
    constructor(dprice: ProductDefaultPriceType ) {
        this.category = dprice.category;
        this.default_prices = dprice.default_prices;
    }
}
export default ProductDefaultPriceDto;

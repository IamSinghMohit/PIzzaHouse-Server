import { TCategoryPriceSection } from "../models/categoryPriceSection";
class AdminCategoryPriceSectionDto {
    id;
    name;
    attributes;

    constructor(priceAttr: TCategoryPriceSection  ) {
        this.id = priceAttr._id;
        this.name = priceAttr.name;
        this.attributes = priceAttr.attributes;
    }
}
export default AdminCategoryPriceSectionDto ;

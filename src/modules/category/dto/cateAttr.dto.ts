import { CategoryAttrType } from "../models/categoryAttr.model";
class CategoryAttrDto {
    id;
    attribute_title;
    categoryId;
    attributes;

    constructor(priceAttr: CategoryAttrType) {
        this.id = priceAttr._id;
        this.attribute_title = priceAttr.attribute_title;
        this.categoryId = priceAttr.categoryId;
        this.attributes = priceAttr.attributes;
    }
}
export default CategoryAttrDto;

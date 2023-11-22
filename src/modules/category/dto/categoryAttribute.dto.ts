import { CategoryAttributeType } from "../models/categoryAttributes";
class CategoryAttrDto {
    id;
    attribute_title;
    categoryId;
    attributes;

    constructor(priceAttr: CategoryAttributeType ) {
        this.id = priceAttr._id;
        this.attribute_title = priceAttr.attribute_title;
        this.categoryId = priceAttr.category_id;
        this.attributes = priceAttr.attributes;
    }
}
export default CategoryAttrDto;

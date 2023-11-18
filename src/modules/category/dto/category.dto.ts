import { CategoryType} from "../models/category.model";


class CategoryDto {
    id;
    image;
    name;
    price_attributes;
    created_at;
    updated_at;
    constructor(category: CategoryType) {
        this.id = category._id;
        this.image = category.image;
        this.name = category.name;
        this.price_attributes = category.price_attributesId;
        this.created_at = category.createdAt
        this.updated_at = category.updatedAt
    }
}

export default CategoryDto
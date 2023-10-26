import { CategoryType} from "../models/category.model";

class CategoryDto {
    id;
    image;
    name;
    price_Atrributes;
    createdAt;
    updatedAt;
    constructor(category: CategoryType) {
        this.id = category._id;
        this.image = category.image;
        this.name = category.name;
        this.price_Atrributes = category.price_attributesId;
        this.createdAt = category.createdAt
        this.updatedAt = category.updatedAt
    }
}

export default CategoryDto
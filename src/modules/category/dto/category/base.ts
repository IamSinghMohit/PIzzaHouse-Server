import { TCategory } from "../../models/category.model";
class BaseCategoryDto {
    id;
    image;
    name;
    constructor(category: TCategory) {
        this.id = category._id;
        this.image = category.image;
        this.name = category.name;
    }
}

export default BaseCategoryDto;

import { TCategory } from "../../models/category.model";
import BaseCategoryDto from "./base";
class AdminCategoryDto extends BaseCategoryDto{
    sections;
    created_at;
    updated_at;
    constructor(category: TCategory ) {
        super(category)
        this.sections = category.sections;
        this.created_at = category.createdAt
        this.updated_at = category.updatedAt
    }
}
export default AdminCategoryDto 
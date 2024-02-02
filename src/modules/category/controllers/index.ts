import { asyncHandler } from "@/middlewares";
import CategoryCreate from "./create";
import CategoryRead from "./read";
import CategoryDelete from "./delete";
import CategoryUpdate from "./update";

class CategoryController {
    private static wrapper = asyncHandler;
    static createCategory = this.wrapper(CategoryCreate.createCategory);
    static getCategories = this.wrapper(CategoryRead.getCategories);
    static deleteCategory = this.wrapper(CategoryDelete.deleteCategory);
    static searchCategory = this.wrapper(CategoryRead.searchCategory);
    static updateCategory = this.wrapper(CategoryUpdate.category);
    static getSections = this.wrapper(CategoryRead.getSections);
}
export default CategoryController;

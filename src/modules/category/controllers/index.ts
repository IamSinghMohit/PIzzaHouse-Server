import { asyncHandler } from "@/middlewares";
import CategoryCreate from "./create";
import CategoryRead from "./read";
import CategoryDelete from "./delete";
import CategoryUpdate from "./update";

class CategoryController {
    private static controllerWrapper = asyncHandler;
    static createCategory = CategoryController.controllerWrapper(
        CategoryCreate.createCategory
    );
    static getCategories = CategoryController.controllerWrapper(
        CategoryRead.getCategories
    );
    static deleteCategory = CategoryController.controllerWrapper(
        CategoryDelete.deleteCategory
    );
    static searchCategory = CategoryController.controllerWrapper(
        CategoryRead.searchCategory
    );
    static updateCategory = CategoryController.controllerWrapper(
        CategoryUpdate.updateCategory
    );
    static getSections = CategoryController.controllerWrapper(
        CategoryRead.getSections
    );
}
export default CategoryController;

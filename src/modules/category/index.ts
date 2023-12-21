import { Router } from "express";
import CategoryController from "./controllers";
import { upload } from "@/middlewares";
import { CategoryValidator } from "./category.validator";
const router = Router();

router.post(
    "/create",
    upload.single("image"),
    CategoryValidator.createCategory,
    CategoryController.createCategory
);

router.get(
    "/admin",
    CategoryValidator.getCategories,
    CategoryController.getCategories
);

router.delete(
    "/admin/delete/:id",
    CategoryValidator.deleteCategory,
    CategoryController.deleteCategory
);
router.get(
    "/search",
    CategoryValidator.searchCategory,
    CategoryController.searchCategory
);

router.put(
    "/update",
    upload.single("image"),
    CategoryValidator.updateCategory,
    CategoryController.updateCategory
);

router.get(
    "/sections/:id",
    CategoryValidator.getSections,
    CategoryController.getSections
);
export default router;

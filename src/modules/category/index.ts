import { Router } from "express";
import CategoryController from "./controllers";
import { Validator, upload } from "@/middlewares";
import { CategoryValidator } from "./category.validator";
const router = Router();

router.post(
    "/admin/create",
    upload.single("image"),
    Validator.admin,
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
    Validator.admin,
    CategoryValidator.deleteCategory,
    CategoryController.deleteCategory
);
router.get(
    "/search",
    CategoryValidator.searchCategory,
    CategoryController.searchCategory
);

router.patch(
    "/admin/update",
    upload.single("image"),
    Validator.admin,
    CategoryController.updateCategory
);

router.get(
    "/admin/sections/:id",
    CategoryValidator.getSections,
    CategoryController.getSections
);
export default router;

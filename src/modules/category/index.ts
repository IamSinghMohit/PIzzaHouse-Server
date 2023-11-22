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
    "/",
    CategoryValidator.getCategories,
    CategoryController.getCategories
);

router.delete(
    "/delete/:id",
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

router.get("/attributes/:id", CategoryController.getAttributes);
export default router;

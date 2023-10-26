import { Router } from "express";
import CategoryController from "../controllers/category.ctontroller";
import { Validate, asyncHandler, upload } from "@/middlewares";
import { CategoryValidator } from "../category.validator";
const router = Router();

router.post(
    "/create",
    upload.single("image"),
    CategoryValidator.createCategory,
    // Validate.admin,
    asyncHandler(CategoryController.craeteCategory)
);

router.get("/", asyncHandler(CategoryController.getCategories));

router.delete(
    "/delete/:id/:image",
    CategoryValidator.deleteCategory,
    asyncHandler(CategoryController.deleteCategory)
);
router.get(
    "/search",
    CategoryValidator.searchCategory,
    asyncHandler(CategoryController.searchCategory)
);
export default router;

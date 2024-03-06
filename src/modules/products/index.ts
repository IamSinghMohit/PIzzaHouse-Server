import { Validator, upload } from "@/middlewares";
import { Router } from "express";
import ProductValidator from "./product.validator";
import ProductController from "./controller";
const router = Router();

// Admin CRUD routes
router.post(
    "/admin/create",
    upload.single("image"),
    Validator.admin,
    ProductValidator.createProduct,
    ProductController.createProduct,
);
router.delete(
    "/admin/:id",
    Validator.admin,
    ProductValidator.deleteProduct,
    ProductController.deleteProduct,
);
router.get(
    "/admin/all",
    ProductValidator.getProducts,
    ProductController.getProducts,
);
router.patch(
    "/admin",
    upload.single("image"),
    Validator.admin,
    ProductValidator.updateProduct,
    ProductController.updateProduct,
);
// ------>

router.get(
    "/sections/:id",
    ProductValidator.getProductPriceSections,
    ProductController.getProductPriceSection,
);
router.get(
    "/formated",
    ProductValidator.getFromatedProducts,
    ProductController.getFromatedProducts,
);
router.get(
    "/",
    ProductValidator.getCursorPaginatedProducts,
    ProductController.getCursorPaginatedProducts,
);
router.get(
    "/minimal-info/:id?",
    ProductValidator.minimalInfo,
    ProductController.getMinimalInfo,
);
router.get("/stats", ProductController.getProductStats);

router.get("/product/:id", ProductValidator.getProduct, ProductController.getProduct);

export default router;

import { upload } from "@/middlewares";
import { Router } from "express";
import ProductValidator from "./product.validator";
import ProductController from "./controller";
const router = Router();

// Admin CRUD routes
router.post(
    "/admin/create",
    upload.single("image"),
    ProductValidator.createProduct,
    ProductController.createProduct,
);
router.delete(
    "/admin/:id",
    ProductValidator.deleteProduct,
    ProductController.deleteProduct,
);
router.get(
    "/admin/all",
    ProductValidator.getProducts,
    ProductController.getProducts,
);
router.put(
    "/admin/:id",
    upload.single("image"),
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
router.get("/stats", ProductController.getProductStats);

// router.get("/:id", ProductValidator.getProduct, ProductController.getProduct);

export default router;

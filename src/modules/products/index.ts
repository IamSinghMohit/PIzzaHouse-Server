import { upload } from "@/middlewares";
import { Router } from "express";
import ProductValidator from "./product.validator";
import ProductController from "./controller";
const router = Router();

router.post(
    "/admin/create",
    upload.single("image"),
    ProductValidator.createProduct,
    ProductController.createProduct
);
router.get("/admin/all", ProductValidator.getProducts, ProductController.getProducts);
router.get(
    "/sections/:id",
    ProductValidator.getProductPriceSections,
    ProductController.getProductPriceSection
);
router.delete(
    "/admin/:id",
    ProductValidator.deleteProduct,
    ProductController.deleteProduct
);
router.get(
    "/formated",
    ProductValidator.getFromatedProducts,
    ProductController.getFromatedProducts
);
router.put('/admin/:id',
)

// router.get("/:id", ProductValidator.getProduct, ProductController.getProduct);

export default router;

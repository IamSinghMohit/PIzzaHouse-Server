import { upload } from "@/middlewares";
import { Router } from "express";
import ProductValidator from "./product.validator";
import ProductController from "./controller";
const router = Router();

router.post(
    "/create",
    upload.single("image"),
    ProductValidator.createProduct,
    ProductController.createProduct
);
router.get("/", ProductValidator.getProducts, ProductController.getProducts);
router.get(
    "/attributes/:id",
    ProductValidator.getProductAttributes,
    ProductController.getProductAttributes
);
router.delete(
    "/:id",
    ProductValidator.deleteProduct,
    ProductController.deleteProduct
);

export default router;

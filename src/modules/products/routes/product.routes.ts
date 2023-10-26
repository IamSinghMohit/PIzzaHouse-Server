import { Validate, asyncHandler, upload } from "@/middlewares";
import { Router } from "express";
import ProductController from "../controller/product.controller";
const router = Router();

router.post(
    "/create",
    upload.single("image"),
    Validate.product,
    asyncHandler(ProductController.createProduct)
);

export default router;

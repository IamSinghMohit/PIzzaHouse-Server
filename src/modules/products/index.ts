import {  upload } from "@/middlewares";
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

export default router;

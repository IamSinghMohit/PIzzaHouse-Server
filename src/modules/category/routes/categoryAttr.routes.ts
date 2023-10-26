import { Router } from "express";
import CategoryAttrController from "../controllers/categoryAttr.controller";
import { asyncHandler,Validate } from "@/middlewares";

const router = Router();

router.get(
    "/:id",
    // Validate.admin,
    asyncHandler(CategoryAttrController.getAttributes)
);

// router.post(
//     "/update",
//     Validate.admin,
//     PriceAttributeController.updatePriceAttr
// );

export default router
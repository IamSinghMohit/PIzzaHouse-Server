import { Validate, upload } from "@/middlewares";
import { Router } from "express";
import TopingsController from "./controller";
import TopingValidator from "./topings.validator";

const router = Router();

router.post(
    "/create",
    upload.single("image"),
    TopingValidator.createToping,
    TopingsController.create
);
router.get('/category/:category',
    TopingValidator.GetTopingWithCategory,
    TopingsController.getWithCategory,
)

export default router;

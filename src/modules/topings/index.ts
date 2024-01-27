import { upload } from "@/middlewares";
import { Router } from "express";
import TopingValidator from "./topings.validator";
import TopingController from "./controller";

const router = Router();

// Admin routes
router.post(
    "/admin/create",
    upload.single("image"),
    TopingValidator.createToping,
    TopingController.create
);
router.get('/admin/all',
    TopingValidator.getAllTopings,
    TopingController.getAllTopings
)
router.get('/category/:category',
    TopingValidator.GetTopingWithCategory,
    TopingController.getWithCategory,
)
router.get('/admin/stats',TopingController.getStats)

export default router;

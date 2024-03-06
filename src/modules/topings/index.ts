import { Validator, upload } from "@/middlewares";
import { Router } from "express";
import TopingValidator from "./topings.validator";
import TopingController from "./controller";

const router = Router();

// Admin routes
router.post(
    "/admin/create",
    upload.single("image"),
    Validator.admin,
    TopingValidator.createToping,
    TopingController.create
);
router.get('/admin/all',
    TopingValidator.getAllTopings,
    TopingController.getAllTopings
)
router.patch("/admin",
    upload.single("image"),
    Validator.admin,
    TopingValidator.updateToping,
    TopingController.updateToping
)
router.delete("/admin/:id",
    Validator.admin,
    TopingValidator.deleteToping,
    TopingController.deleteToping
)

router.get('/category/:category',
    TopingValidator.GetTopingWithCategory,
    TopingController.getWithCategory,
)
router.get('/admin/stats',TopingController.getStats)

export default router;

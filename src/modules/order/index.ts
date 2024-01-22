import express from "express";
import OrderController from "./controller";
import OrderValidator from "./orderValiator";
import { ResponseService } from "@/services";
const router = express.Router();

router.post(
    "/create",
    OrderValidator.create,
    OrderController.create,
);
router.post(
    "/payment-result",
    express.raw({ type: "application/json" }),
    OrderController.updateOrderWebhook,
);
router.get("/stripe-publish-key", async (req, res) => {
    ResponseService.sendResponse(
        res,
        200,
        true,
        process.env.STRIPE_PUBLISHABLE_KEY,
    );
});
router.get("/admin",OrderController.getOrdersForAdmin)
router.get("/:id",OrderController.getOrder)
router.patch("/:id",OrderController.upateOrderStatus)

export default router;

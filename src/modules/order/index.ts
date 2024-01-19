import { Router } from "express";
import OrderController from "./controller";
import OrderValidator from "./orderValiator";
const router = Router();

router.post("/create", 
    // OrderValidator.create,
    OrderController.create);
router.get("/stripe-publicsh-key", async (req, res) => {
    res.send(process.env.STRIPE_PUBLISHABLE_KEY);
});

export default router;

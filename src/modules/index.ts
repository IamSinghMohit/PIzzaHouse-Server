import { Router } from "express";
import AuthRoute from "./auth";
import CategoryRoutes from "./category";
import ProductRoutes from "./products"
import TopingRoutes from "./topings";
import OrderRoutes from "./order"

const router = Router();
router.use("/auth", AuthRoute);
router.use("/category", CategoryRoutes);
router.use("/product", ProductRoutes);
router.use("/toping", TopingRoutes);
router.use("/order",OrderRoutes)

export default router;

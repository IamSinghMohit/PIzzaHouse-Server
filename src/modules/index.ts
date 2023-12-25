import { Router } from "express";
import AuthRoute from "./auth";
import CategoryRoutes from "./category";
import ProductRoutes from "./products"
import TopingRoutes from "./topings";

const router = Router();
router.use("/auth", AuthRoute);
router.use("/category", CategoryRoutes);
router.use("/product", ProductRoutes);
// router.use("/toping", TopingRoutes);

export default router;

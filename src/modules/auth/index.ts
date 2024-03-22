import { Router } from "express";
import passport from "passport";
import { asyncHandler, Validator } from "@/middlewares";
import AuthController from "./auth.controller";
import CartController from "./cart.controller";
import CartValidator from "./cartValidator";
import RateLimitter from "@/middlewares/rate-limmiter";

const router = Router();

router.get(
    "/login/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureMessage: "Cannot login",
    }),
    asyncHandler(AuthController.google),
);

router.post("/signin", Validator.signin, RateLimitter, AuthController.signin);
router.post("/login", Validator.login, RateLimitter, AuthController.login);

router.get("/logout", AuthController.logout);
router.get("/refresh", AuthController.refresh);

router.get("/me", Validator.authenticate, AuthController.me);

router.get("/cart", Validator.authenticate, CartController.getProducts);
router.patch(
    "/cart/:id",
    Validator.authenticate,
    CartValidator.deleteItem,
    CartController.deleteItem,
);
export default router;

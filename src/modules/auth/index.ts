import { Router } from "express";
import passport from "passport";
import { asyncHandler, Validate } from "@/middlewares";
import AuthController from "./auth.controller";

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

router.post("/signin", Validate.signin, AuthController.signin);
router.post("/login", Validate.login, AuthController.login);

router.get("/logout", AuthController.logout);
router.get("/refresh", AuthController.refresh);

router.get("/me", Validate.passport, AuthController.me);

export default router;

import { Router } from "express";
import passport from "passport";
import { asyncHandler, Validate } from "@/middlewares";
import AuthController from "./auth.controller";

const router = Router();

router.get(
    "/login/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureMessage: "Cannot login",
    }),
    asyncHandler(AuthController.google)
);

router.post("/signin", Validate.signin, asyncHandler(AuthController.signin));
router.post("/login", Validate.login, asyncHandler(AuthController.login));

router.get("/logout",asyncHandler(AuthController.logout));
router.get("/refresh", asyncHandler(AuthController.refresh));

router.get("/me", Validate.passport, (req, res) => {
    res.json(req.user);
});
export default router;

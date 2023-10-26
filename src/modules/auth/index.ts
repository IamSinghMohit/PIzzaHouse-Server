import { Router } from "express";
import  passport from "passport";
import { asyncHandler,Validate } from "@/middlewares";
import AuthController from "./auth.controller";

const router = Router()

router.get(
    "/login/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureMessage: "Cannot login",
    }),
    (req, res) => {}
);

router.post(
    "/signin",
    Validate.signin,
    asyncHandler(AuthController.signin)
);
router.post("/login", Validate.login, asyncHandler(AuthController.login));
router.get("/refresh", asyncHandler(AuthController.refresh));
router.get(
    "/me",
    Validate.passport,
    (req, res) => {
        res.json({user:req.user});
    }
);
export default router
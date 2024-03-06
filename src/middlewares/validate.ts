import { LoginSchema, SigninSchema } from "@/modules/auth/schema/auth.schema";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import Validator from "@/utils/validatorWrapper.";
import { TUser } from "@/modules/auth/models/user.model";

class AuthValidator {
    static signin = Validator.ReqBody(SigninSchema);
    static login = Validator.ReqBody(LoginSchema);

    static async authenticate(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", { session: false })(req, res, next);
    }
    static async admin(req: Request, res: Response, next: NextFunction) {
        passport.authenticate(
            "jwt",
            { session: false },
            (err: Error, user: TUser) => {
                console.log(user)
                if (!user || user.role !== "admin") {
                    return res.status(401).json({
                        success: false,
                        error: {
                            code: 401,
                            message: "Unauthorized",
                        },
                    });
                }
                req.user = user;
                return next();
            },
        )(req, res, next);
    }
}
export default AuthValidator;

import { LoginSchema, SigninSchema } from "@/modules/auth/schema/auth.schema";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { TUser } from "@/modules/auth/models/user.model";

class Validator {
    static async signin(req: Request, res: Response, next: NextFunction) {
        try {
            await SigninSchema.parseAsync(req.body);
            return next();
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            await LoginSchema.parseAsync(req.body);
            return next();
        } catch (error) {
            next(error);
        }
    }

    static async authenticate(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", { session: false })(req, res, next);
    }

    static async admin(req: Request, res: Response, next: NextFunction) {
        passport.authenticate(
            "jwt",
            { session: false },
            (err: Error, user: TUser) => {
                if (!user || user.role !== "admin") {
                    // User not authenticated, handle accordingly
                    return res.status(401).json({ message: "Unauthorized" });
                }
                // User is authenticated, you can access user data with req.user
                req.user = user;
                return next();
            },
        )(req, res, next);
    }
}
export default Validator ;

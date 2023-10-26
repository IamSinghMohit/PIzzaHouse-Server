import { LoginSchema, SigninSchema } from "@/modules/auth/schema/auth.schema";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { UserType } from "@/modules/auth/models/user.model";
import { ProductSchemaWithAttr } from "@/modules/products/schema/product.schema";
import { TopingsSchema } from "@/modules/topings/topings.schema";

class Validate {
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

    static async passport(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", { session: false })(req, res, next);
    }

    static async admin(req: Request, res: Response, next: NextFunction) {
        passport.authenticate(
            "jwt",
            { session: false },
            (err: Error, user: UserType) => {
                if (!user || user.role !== "admin") {
                    // User not authenticated, handle accordingly
                    return res.status(401).json({ message: "Unauthorized" });
                }
                // User is authenticated, you can access user data with req.user
                req.user = user;
                return next();
            }
        )(req, res, next);
    }

    // static async updatePriceAttr(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     try {
    //         await UpdateCatePriceAttSchema.parseAsync(req.body);
    //         return next();
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    static async product(req: Request, res: Response, next: NextFunction) {
        try {
            const obj = {
                ...req.body,
                price_attributes: JSON.parse(req.body.price_attributes_json),
                price: parseInt(req.body.price),
            };
            req.body = obj;
            await ProductSchemaWithAttr.parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }

    static async topings(req: Request, res: Response, next: NextFunction) {
        try {
            await TopingsSchema.parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
}
export default Validate;

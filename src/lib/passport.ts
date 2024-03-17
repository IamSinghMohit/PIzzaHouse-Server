import { Request } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
import PassportGoogle from "passport-google-oauth20";
import UserDto from "../modules/auth/dto/user.dto";
import ErrorResponse from "../utils/error-response";
import { UserModel } from "../modules/auth/models/user.model";
import { IdJwtResponse } from "../modules/auth/schema/jwt.schema";
import { CartModel } from "../modules/auth/models/cart.model";
const JWTStrategy = passportJWT.Strategy;
const GoogleStrategy = PassportGoogle.Strategy;

const cookieExtractor = function (req: Request) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["accessToken"];
    }
    return token;
};

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
        },
        async (jwtPayload: IdJwtResponse, done) => {
            const { exp, id } = jwtPayload;
            if (!exp) return;
            if (Date.now() > exp * 1000) {
                done("Unauthorized", false);
            }
            let user = await UserModel.findOne({ _id: id })
                .lean()
                .cacheQuery({ ttl: 600 });
            if (user) {
                return done(null, {
                    id: user._id.toString(),
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar,
                    email: user.email,
                    role: user.role,
                });
            }
            return done(new ErrorResponse("User not found", 404), false);
        },
    ),
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "http://localhost:3001/auth/google/callback",
            passReqToCallback: true,
        },
        async (
            _req: Request,
            _accessToken: string,
            _refreshToken: string,
            profile: any,
            cb: PassportGoogle.VerifyCallback,
        ) => {
            const defaultUser = {
                email: profile._json.email,
                avatar: profile._json.picture,
                first_name: profile._json.name,
                last_name: "",
            };

            /* LOGING HERE  */
            let user = await UserModel.findOne({
                email: defaultUser.email,
            })
                .lean()
                .cacheQuery({ ttl: 600 });
            if (!user) {
                user = await UserModel.create(defaultUser);
                await CartModel.create({ user_id: user._id, orders_ids: [] });
            }
            return cb(null, new UserDto(user));
        },
    ),
);

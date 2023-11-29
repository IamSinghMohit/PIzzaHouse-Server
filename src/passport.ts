import { Request } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
import UserService from "./modules/auth/service/user.service";
import PassportGoogle from "passport-google-oauth20";
import UserDto from "./modules/auth/dto/user.dto";
import ErrorResponse from "./utils/error-response";
import { JwtResponse } from "./modules/auth/schema/jwt.schema";
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
        async (jwtPayload: JwtResponse, done) => {
            const { exp, _id } = jwtPayload;
            if (!exp) return;
            if (Date.now() > exp * 1000) {
                done("Unauthorized", false);
            }
            let user = await UserService.findUser({ _id });
            if (user) {
                return done(null, new UserDto(user));
            }
            return done(new ErrorResponse("User not found", 404), false);
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
            callbackURL: "http://localhost:3001/auth/google/callback",
            passReqToCallback: true,
        },
        async (
            req: Request,
            accessToken: string,
            refreshToken: string,
            profile: any,
            cb: PassportGoogle.VerifyCallback
        ) => {
            const defaultUser = {
                name: profile._json.name,
                email: profile._json.email,
                avatar: profile._json.picture,
                googleId: profile._json.id,
            };
            /* LOGING HERE  */
            const user = UserService.findOrCreate(
                { email: defaultUser.email },
                defaultUser
            ).catch((e) => cb(e ));
            return cb(null, user);
        }
    )
);

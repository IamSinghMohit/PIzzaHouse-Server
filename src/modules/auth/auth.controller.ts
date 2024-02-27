import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "@/utils";
import { ResponseService } from "@/services";
import UserDto from "./dto/user.dto";
import { UserModel } from "./models/user.model";
import jwt from "jsonwebtoken";
import { IdJwtInput, IdJwtResponse } from "./schema/jwt.schema";
import { RefreshModel } from "./models/refresh.model";
import { asyncHandler } from "@/middlewares";
import { CartModel } from "./models/cart.model";
import mongoose from "mongoose";
import { TLoginSchema, TSigninSchema } from "./schema/auth.schema";

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET!;

class AuthController {
    private static wrapper = asyncHandler;

    private static verifyRefreshToken(refreshToken: string) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    private static generateTokens(payload: IdJwtInput) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: "7d",
        });
        return { accessToken, refreshToken };
    }

    static signin = this.wrapper(
        async (
            req: Request<{}, {}, TSigninSchema>,
            res: Response,
            next: NextFunction,
        ) => {
            const { email, password, first_name, last_name } = req.body;
            const isExist = await UserModel.findOne({ email });

            if (isExist) {
                return next(new ErrorResponse("Email already exists", 403));
            }
            const session = await mongoose.startSession();

            await session.withTransaction(async () => {
                const user = await UserModel.create(
                    [
                        {
                            email,
                            password,
                            first_name,
                            last_name,
                            avatar: "",
                        },
                    ],
                    { session },
                );
                const { refreshToken, accessToken } = this.generateTokens({
                    id: user[0]._id,
                });

                await Promise.all([
                    CartModel.create(
                        [
                            {
                                user_id: user[0]._id,
                                orders_ids: [],
                            },
                        ],
                        { session },
                    ),
                    RefreshModel.create(
                        [
                            {
                                user_id: user[0]._id,
                                token: refreshToken,
                            },
                        ],
                        { session },
                    ),
                ]);

                ResponseService.sendCookiesAsTokens(res, {
                    accessToken,
                    refreshToken,
                });
                ResponseService.sendResponse(
                    res,
                    201,
                    true,
                    new UserDto(user[0]),
                );
            });
            await session.endSession()
        },
    );

    static login = this.wrapper(
        async (
            req: Request<{}, {}, TLoginSchema>,
            res: Response,
            next: NextFunction,
        ) => {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });

            if (!user) {
                return next(new ErrorResponse("User does not exist", 404));
            }
            const verifiedUser = await user.comparePassword(password);

            if (!verifiedUser) {
                return next(new ErrorResponse("Invalid credentials", 404));
            }
            const { refreshToken, accessToken } = this.generateTokens({
                id: user._id,
            });

            await RefreshModel.findOneAndUpdate(
                { user_id: user._id },
                { token: refreshToken },
            );

            ResponseService.sendCookiesAsTokens(res, {
                accessToken,
                refreshToken,
            });
            ResponseService.sendResponse(res, 201, true, new UserDto(user));
        },
    );

    static refresh = this.wrapper(
        async (req: Request, res: Response, next: NextFunction) => {
            // get refresh token from cookie
            const { refreshToken: refreshTokenFromCookie } = req.cookies;

            if (!refreshTokenFromCookie) {
                return next(new ErrorResponse("token not found", 404));
            }
            // check if token is valid
            const userData = this.verifyRefreshToken(
                refreshTokenFromCookie,
            ) as IdJwtResponse;

            // Check if token is in db
            const token = await RefreshModel.findOne({
                user_id: userData.id,
            });

            if (!token) {
                return res.redirect("/auth/logout");
            }

            // check if valid user
            const validateUser = await UserModel.findOne({
                _id: userData.id,
            });

            if (!validateUser) {
                return next(new ErrorResponse("User does not exist", 404));
            }

            // Generate new tokens
            const { refreshToken, accessToken } = this.generateTokens({
                id: userData.id,
            });
            // Update refresh token

            await RefreshModel.findOneAndUpdate({
                user_id: validateUser._id,
                token: refreshToken,
            });
            // put in cookie

            await ResponseService.sendCookiesAsTokens(res, {
                accessToken,
                refreshToken,
            });
            await ResponseService.sendResponse(
                res,
                200,
                true,
                "Token refreshed",
            );
        },
    );

    static me(req: Request, res: Response, next: NextFunction) {
        const user = req.user as UserDto;
        ResponseService.sendResponse(res, 200, true, user);
    }

    static google = this.wrapper(async (req: Request, res: Response) => {
        const user = req.user as UserDto;
        const { refreshToken, accessToken } = this.generateTokens({
            id: user.id,
        });
        await RefreshModel.findOneAndUpdate(
            { user_id: user.id },
            { token: refreshToken, user_id: user.id },
            { upsert: true },
        );
        ResponseService.sendCookiesAsTokens(res, { accessToken, refreshToken });
        res.redirect("http://localhost:3000");
    });

    static async logout(_req: Request, res: Response) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        ResponseService.sendResponse(res,200,true,"logout successfull")
    }
}
export default AuthController;

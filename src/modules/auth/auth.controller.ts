import { NextFunction, Request, Response } from "express";
import { LoginType,SigninType } from "./schema/auth.schema";
import { ErrorResponse } from "@/utils";
import TokenService from "./service/token.service";
import UserService from "./service/user.service.";
import { ResponseService } from "@/services";
import UserDto from "./dto/user.dto";

class AuthController {
    static async signin(
        req: Request<{}, {}, SigninType>,
        res: Response,
        next: NextFunction
    ) {
        const { email } = req.body;
        const isExist = await UserService.findUser({ email });

        if (isExist) {
            return next(new ErrorResponse("Email already exists", 403));
        }
        const user = await UserService.createUser(req.body);
        const { refreshToken, accessToken } = TokenService.generateTokens({
            _id: user._id,
        });
        
        ResponseService.sendCookiesAsTokens(res, { accessToken, refreshToken });
        ResponseService.sendResWithData(res, 201, new UserDto(user));
    }

    static async login(
        req: Request<{}, {}, LoginType>,
        res: Response,
        next: NextFunction
    ) {
        const { email, password } = req.body;
        const user = await UserService.findUser({ email });

        if (!user) {
            return next(new ErrorResponse("User does not exist", 404));
        }
        const verifiedUser = await user.comparePassword(password);
        if (verifiedUser) {
            const { refreshToken, accessToken } = TokenService.generateTokens({
                _id: user._id,
            });
            TokenService.CreateOrUpdateRefreshToken(user._id, refreshToken);
            ResponseService.sendCookiesAsTokens(res, {
                accessToken,
                refreshToken,
            });
            ResponseService.sendResWithData(res, 201, new UserDto(user));
        } else {
            return next(new ErrorResponse("Invalid credentials", 404));
        }
    }

    static async refresh(req: Request, res: Response, next: NextFunction) {
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        if (!refreshTokenFromCookie) {
            return next(new ErrorResponse("invalid token", 404));
        }
        // check if token is valid
        const userData = await TokenService.verifyRefreshToken(
            refreshTokenFromCookie
        );

        // Check if token is in db
        const token = await TokenService.findRefreshToken(
            userData._id,
            refreshTokenFromCookie
        );

        if (!token) {
            return next(new ErrorResponse("invalid token", 404));
        }

        // check if valid user
        const validateUser = await UserService.findUser({_id:userData._id})

        if (!validateUser) {
            return next(new ErrorResponse("User doesh not exist", 404));
        }

        // Generate new tokens
        const { refreshToken, accessToken } = TokenService.generateTokens({
            _id: userData._id,
        });
        // Update refresh token

        await TokenService.CreateOrUpdateRefreshToken(validateUser._id,refreshToken);
        // put in cookie

        await ResponseService.sendCookiesAsTokens(res, {
            accessToken,
            refreshToken,
        });
        await ResponseService.sendResWithData(res,200,{success:true})
    }
}
export default AuthController;

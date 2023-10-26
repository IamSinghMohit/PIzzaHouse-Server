import jwt from "jsonwebtoken";
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET as string
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET as string
import { RefreshModel } from "../models/refresh.model";
import { JwtResponse,JwtInput } from "../schema/jwt.schema";
import { Types } from "mongoose";

class TokenService {
    static generateTokens(payload: JwtInput) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: "50m",
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: "50m",
        });
        return { accessToken, refreshToken };
    }

    static async verifyRefreshToken(
        refreshToken: string
    ): Promise<JwtResponse> {
        return jwt.verify(refreshToken, refreshTokenSecret) as JwtResponse;
    }

    static async findRefreshToken(userId: string, refreshToken: string) {
        return await RefreshModel.findOne({
            userId: userId,
            token: refreshToken,
        })
    }


    static async CreateOrUpdateRefreshToken(
        userId: Types.ObjectId,
        refreshToken: string
    ) {
        return await RefreshModel.findOneAndUpdate(
            { userId: userId },
            { token: refreshToken },
            { upsert: true }
        );
    }

    static async removeToken(refreshToken: string) {
        return await RefreshModel.deleteOne({ token: refreshToken });
    }
}

export default TokenService;

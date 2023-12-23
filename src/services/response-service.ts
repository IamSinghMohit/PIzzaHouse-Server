import { Response } from "express";

class ResponseService {
    static async sendCookiesAsTokens(
        res: Response,
        data: { refreshToken: string; accessToken: string }
    ) {
        res.cookie("refreshToken", data.refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie("accessToken", data.accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
    }

    static async sendResWithData(res: Response, status: number, data: any) {
        res.status(status).json(data);
    }

    static async sendResponse<
        T extends boolean,
        TReturn = T extends true ? any : { code: number; message: string }
    >(res: Response, status: number, success: T, payload: TReturn) {
        res.status(status).json({
            success,
            ...(success ? { data: payload } : { error: payload }),
        });
    }
}
export default ResponseService;

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

    static async sendResponse(
        res: Response,
        status: number,
        data: any,            // there will be only one payload error or data 
        success: boolean,
        error: { code: number; message: string }
    ) {
        res.status(status).json({
            success,
            data,
            error,
        });
    }
}
export default ResponseService;

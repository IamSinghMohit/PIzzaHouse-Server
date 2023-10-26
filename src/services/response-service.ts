import { Response } from "express";
import UserDto from "@/modules/auth/dto/user.dto";

class ResponseService {
    static async sendCookiesAsTokens(res:Response, data:{refreshToken:string,accessToken:string}) {
        res.cookie("refreshToken", data.refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie("accessToken", data.accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });
    }
    static async sendResWithData(res:Response,status:number,data:any){
        res.status(status).json(data)
    }
}
export default ResponseService
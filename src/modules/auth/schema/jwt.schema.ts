import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export interface IdJwtInput{
    id:string  | Types.ObjectId;
}
export interface  IdJwtResponse extends JwtPayload {
    id:string;
}

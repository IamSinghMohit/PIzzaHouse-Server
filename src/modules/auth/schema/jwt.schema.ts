import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export interface JwtInput{
    _id:string  | Types.ObjectId;
}
export interface  JwtResponse extends JwtPayload {
    _id:string;
}
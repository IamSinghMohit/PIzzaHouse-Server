import RedisClient from "@/lib/redis";
import { ErrorResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";

type RedisReponse = [[unknown, number], [unknown, number]];

export default async function RateLimitter(
    req: Request,
    _: Response,
    next: NextFunction,
) {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress )as string;
    const [response] = (await RedisClient.multi()
        .incr(ip)
        .expire(ip, 60)
        .exec()) as RedisReponse;

    if (response[1] > 10) {
        return next(new ErrorResponse("too many request", 429));
    }
    next();
}

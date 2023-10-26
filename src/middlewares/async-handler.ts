import { Request, Response, NextFunction } from "express";
const asyncHandler =
    (
        controllerFunction: (
            req: Request<any,any,any,any>,
            res: Response,
            next: NextFunction
        ) => void
    ) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(controllerFunction(req, res, next)).catch(next);
export default asyncHandler
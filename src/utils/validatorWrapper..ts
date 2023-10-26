import { NextFunction, Request, Response } from "express";
import { Schema } from "zod"; // Import Zod's Schema type

class Validator {
    static ReqBody(schema: Schema<any>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.parseAsync(req.body);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
    static ReqParams(schema: Schema<any>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.parseAsync(req.params);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
    static ReqQuery(schema: Schema<any>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.parseAsync(req.query);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
export default Validator;

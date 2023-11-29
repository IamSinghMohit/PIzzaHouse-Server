import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";
import ErrorResponse from "./error-response";

class Validator {
    static ReqBody(
        schema: Schema<any>,
        modify?: (
            req: any
        ) => Record<string, string | number | boolean | object>
    ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                let data: any = req.body;
                if (modify) {
                    try {
                        data = modify(req);
                    } catch (error) {
                        return next(new ErrorResponse("invalid input", 422));
                    }
                }
                req.body = schema.parse(data);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
    static ReqParams(
        schema: Schema<any>,
        modify?: (
            req: any
        ) => Record<string, string | number | boolean | object>
    ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            console.log('inside validator')
            try {
                let data: any = req.params;
                if (modify) {
                    try {
                        data = modify(req);
                    } catch (error) {
                        return next(new ErrorResponse("invalid input", 422));
                    }
                }
                req.params = schema.parse(req.params);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
    static ReqQuery(
        schema: Schema<any>,
        modify?: (
            req: any
        ) => Record<string, string | number | boolean | object>
    ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                let data: any = req.query;
                if (modify) {
                    try {
                        data = modify(req);
                    } catch (error) {
                        return next(new ErrorResponse("invalid input", 422));
                    }
                }
                req.query = schema.parse(data);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
export default Validator;

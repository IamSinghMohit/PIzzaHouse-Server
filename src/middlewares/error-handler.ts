import { ErrorResponse } from "@/utils";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);
    let error = { ...err };

    error.message = err.message;

    if (err.name === "CastError") {
        const message = "Resource not found";
        error = new ErrorResponse(message, 404);
    }

    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((error: any) => error.message)
            .join(", ");
        error = new ErrorResponse(message, 422);
    }

    if (err.name === "ZodError") {
        const message = Object.values(err.errors)
            .map((error: any) => `${error.path[0]} ${error.message}`)
            .join(", ");
        error = new ErrorResponse(message, 422);
    }

    if (err.name === "TokenExpiredError") {
        const message = "Invalid Token";
        error = new ErrorResponse(message, 404);
    }

    if (err === "jwt-unathorized") {
        const message = "Invalid Token";
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: {
            code: error.statusCode || 500,
            message: error.message || "Server Error",
        },
    });
};

export default errorHandler;

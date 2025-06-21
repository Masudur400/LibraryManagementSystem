"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandle = void 0;
const errorHandle = (res, statusCode, message, error) => {
    res.status(statusCode).json({
        success: false,
        message,
        error: formatError(error),
    });
};
exports.errorHandle = errorHandle;
const formatError = (error) => {
    if ((error === null || error === void 0 ? void 0 : error.name) === "ZodError" || error instanceof Error && "errors" in error) {
        return {
            name: "ValidationError",
            errors: error.flatten ? error.flatten().fieldErrors : error.errors,
        };
    }
    if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError") {
        return {
            name: error.name,
            errors: error.errors,
        };
    }
    return typeof error === "object" ? error : { message: error };
};

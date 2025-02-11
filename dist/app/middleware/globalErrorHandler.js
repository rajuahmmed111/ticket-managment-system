"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const ApiErrors_1 = __importDefault(require("../../errors/ApiErrors"));
const handleClientError_1 = __importDefault(require("../../errors/handleClientError"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const config_1 = __importDefault(require("../../config"));
const GlobalErrorHandler = (error, req, res, next) => {
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = error.message || "Something went wrong!";
    let errorMessages = [];
    // handle prisma client validation errors
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle Zod Validation Errors
    else if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle Prisma Client Known Request Errors
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = (0, handleClientError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle Custom ApiError
    else if (error instanceof ApiErrors_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    // Handle Errors
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    // Prisma Client Initialization Error
    else if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message =
            "Failed to initialize Prisma Client. Check your database connection or Prisma configuration.";
        errorMessages = [
            {
                path: "",
                message: "Failed to initialize Prisma Client.",
            },
        ];
    }
    // Prisma Client Rust Panic Error
    else if (error instanceof client_1.Prisma.PrismaClientRustPanicError) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message =
            "A critical error occurred in the Prisma engine. Please try again later.";
        errorMessages = [
            {
                path: "",
                message: "Prisma Client Rust Panic Error",
            },
        ];
    }
    // Prisma Client Unknown Request Error
    else if (error instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = "An unknown error occurred while processing the request.";
        errorMessages = [
            {
                path: "",
                message: "Prisma Client Unknown Request Error",
            },
        ];
    }
    // Generic Error Handling (e.g., JavaScript Errors)
    else if (error instanceof SyntaxError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Syntax error in the request. Please verify your input.";
        errorMessages = [
            {
                path: "",
                message: "Syntax Error",
            },
        ];
    }
    else if (error instanceof TypeError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Type error in the application. Please verify your input.";
        errorMessages = [
            {
                path: "",
                message: "Type Error",
            },
        ];
    }
    else if (error instanceof ReferenceError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Reference error in the application. Please verify your input.";
        errorMessages = [
            {
                path: "",
                message: "Reference Error",
            },
        ];
    }
    // Catch any other error type
    else {
        message = "An unexpected error occurred!";
        errorMessages = [
            {
                path: "",
                message: "An unexpected error occurred!",
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        err: error,
        stack: config_1.default.env !== "production" ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.default = GlobalErrorHandler;

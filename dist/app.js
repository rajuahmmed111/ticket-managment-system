"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const app = (0, express_1.default)();
exports.corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
// Middleware setup
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev')); //TODO remove this when deploy
app.use((0, cors_1.default)(exports.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
// app.use("/uploads", express.static(path.join("/var/www/uploads")));
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads'))); // Serve static files from the "uploads" directory
// Route handler for the root endpoint
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the API!',
    });
});
// Setup API routes
app.use('/api/v1', routes_1.default);
// Error handling middleware
app.use(globalErrorHandler_1.default);
// 404 Not Found handler
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'API NOT FOUND!',
        error: {
            path: req.originalUrl,
            message: 'Your requested path is not found!',
        },
    });
});
exports.default = app;

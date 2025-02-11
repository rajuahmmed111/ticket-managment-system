"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
// user login route
router.post('/login', auth_controller_1.AuthController.loginUser);
router.post('/otp-enter', auth_controller_1.AuthController.enterOtp);
// user logout route
router.post('/logout', (0, auth_1.default)(), auth_controller_1.AuthController.logoutUser);
router.get('/get-me', (0, auth_1.default)(), auth_controller_1.AuthController.getMyProfile);
router.put('/change-password', (0, validateRequest_1.default)(auth_validation_1.authValidation.changePasswordValidationSchema), auth_controller_1.AuthController.changePassword);
// router.put('/change-password', auth(), AuthController.changePassword);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.authRoutes = router;

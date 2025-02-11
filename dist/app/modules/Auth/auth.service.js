"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const emailSender_1 = __importDefault(require("../../../helpers/emailSender"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user using either email or username
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            OR: [
                { email: payload.emailOrUsername },
                { userName: payload.emailOrUsername },
            ],
        },
    });
    if (!userData) {
        throw new Error('User not found');
    }
    // Check if the user account is inactive
    if (userData.UserStatus === client_1.UserStatus.INACTIVE) {
        throw new Error('Your account is inactive');
    }
    // Ensure a password is provided and exists in the user record
    if (!payload.password || !(userData === null || userData === void 0 ? void 0 : userData.password)) {
        throw new Error('Password is required');
    }
    // Verify the password
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error('Password incorrect!');
    }
    // Generate OTP and expiry
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
        <!-- Header Section -->
        <div style="background-color: #FF7600; background-image: linear-gradient(135deg, #FF7600, #45a049); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);">OTP Verification</h1>
        </div>

        <!-- Body Section -->
        <div style="padding: 20px 12px; text-align: center;">
            <p style="font-size: 18px; color: #333333; margin-bottom: 10px;">Hello,</p>
            <p style="font-size: 18px; color: #333333; margin-bottom: 20px;">Your OTP for verifying your account is:</p>
            <p style="font-size: 36px; font-weight: bold; color: #FF7600; margin: 20px 0; padding: 10px 20px; background-color: #f0f8f0; border-radius: 8px; display: inline-block; letter-spacing: 5px;">
                ${randomOtp}
            </p>
            <p style="font-size: 16px; color: #555555; margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto;">
                Please enter this OTP to complete the verification process. This OTP is valid for 5 minutes.
            </p>

            <!-- Footer Message -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 14px; color: #888888; margin-bottom: 4px;">Thank you for choosing our service!</p>
                <p style="font-size: 14px; color: #888888; margin-bottom: 0;">If you didn't request this OTP, please ignore this email.</p>
            </div>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #999999;">
            <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
    yield (0, emailSender_1.default)('OTP', userData.email, html);
    const identifier = crypto.randomBytes(16).toString('hex');
    yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: {
            otp: randomOtp,
            otpExpiry: otpExpiry,
            hexCode: identifier,
        },
    });
    return {
        hexCode: identifier,
    };
});
const enterOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            AND: [{ otp: payload.otp }, { hexCode: payload.hexCode }],
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Invalid OTP');
    }
    if (user.otpExpiry && user.otpExpiry < new Date()) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'OTP has expired');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: user.id,
        email: user.email,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiry: null, hexCode: null },
    });
    return accessToken;
});
const getMyProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            UserStatus: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
            firstName: true,
            lastName: true,
        },
    });
    if (!userProfile) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (userProfile.UserStatus === client_1.UserStatus.INACTIVE) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'Your account is blocked');
    }
    return userProfile;
});
// change password
const changePassword = (userToken, newPassword, oldPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(userToken, newPassword, oldPassword);
    const decodedToken = jwtHelpers_1.jwtHelpers.verifyToken(userToken, config_1.default.jwt.jwt_secret);
    const user = yield prisma_1.default.user.findUnique({
        where: { id: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id },
    });
    if (!user || !(user === null || user === void 0 ? void 0 : user.password)) {
        throw new ApiErrors_1.default(404, 'User not found');
    }
    const isPasswordValid = yield bcrypt.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordValid) {
        throw new ApiErrors_1.default(401, 'Incorrect old password');
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            id: decodedToken.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    return { message: 'Password changed successfully' };
});
// forgot password
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!userData) {
        throw new ApiErrors_1.default(404, 'User not found');
    }
    const resetPassToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)('Reset Your Password', userData.email, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; line-height: 1.6; color: #333333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #FF7600; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
        </div>
        <div style="padding: 40px 30px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear User,</p>

            <p style="font-size: 16px; margin-bottom: 30px;">We received a request to reset your password. Click the button below to reset your password:</p>

            <div style="text-align: center; margin-bottom: 30px;">
                <a href=${resetPassLink} style="display: inline-block; background-color: #FF7600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease;">
                    Reset Password
                </a>
            </div>

            <p style="font-size: 16px; margin-bottom: 20px;">If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>

            <p style="font-size: 16px; margin-bottom: 0;">Best regards,<br>Your Support Team</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d;">
            <p style="margin: 0 0 10px;">This is an automated message, please do not reply to this email.</p>
            <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`);
    return {
        message: 'Reset password link sent via your email successfully',
        resetPassLink,
    };
});
// reset password
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(token)
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
        },
    });
    if (!userData) {
        throw new ApiErrors_1.default(404, 'User not found');
    }
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'Forbidden!');
    }
    // console.log(payload.password);
    // hash password
    const password = yield bcrypt.hash(payload.password, 12);
    yield prisma_1.default.user.update({
        where: {
            id: payload.id,
        },
        data: {
            password,
        },
    });
    return { message: 'Password reset successfully' };
});
// logout
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: {},
    });
    return;
});
exports.AuthServices = {
    login,
    logoutUser,
    enterOtp,
    getMyProfile,
    changePassword,
    forgotPassword,
    resetPassword,
};

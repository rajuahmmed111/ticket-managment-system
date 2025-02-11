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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.checkUsernameExists = void 0;
const bcrypt = __importStar(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const config_1 = __importDefault(require("../../../config"));
const client_1 = require("@prisma/client");
const mongodb_1 = require("mongodb");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        if (existingUser.UserStatus === client_1.UserStatus.INACTIVE) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'This user is inactive and cannot be created.');
        }
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'This user information already exists');
    }
    const existingUserName = yield prisma_1.default.user.findUnique({
        where: { userName: payload.userName },
    });
    if (existingUserName) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'Username already exists!');
    }
    const hashedPassword = yield bcrypt.hash(payload.password, config_1.default.salt || 12);
    const user = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
    const { password, otp, otpExpiry, hexCode } = user, updateUser = __rest(user, ["password", "otp", "otpExpiry", "hexCode"]);
    return updateUser;
});
const checkUsernameExists = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { userName },
    });
    return !!existingUser;
});
exports.checkUsernameExists = checkUsernameExists;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany();
    if (users.length === 0) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'No users found');
    }
    return users;
});
// TODO: check this function
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
const deleteUser = (userId, loggedId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb_1.ObjectId.isValid(userId)) {
        throw new ApiErrors_1.default(400, 'Invalid user ID format');
    }
    if (userId === loggedId) {
        throw new ApiErrors_1.default(403, "You can't delete your own account!");
    }
    // Check if user exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new ApiErrors_1.default(404, 'User not found');
    }
    // Delete the user
    yield prisma_1.default.user.delete({
        where: { id: userId },
    });
    return;
});
const getNewMembers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        where: {
            UserStatus: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            userName: true,
            email: true,
            profileImage: true,
            firstName: true,
            lastName: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
    return users;
});
// update user first name and last name
const updateUser = (email, updates) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(email);
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if ('password' in updates) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'updates are not allowed');
    }
    const { firstName, lastName } = updates;
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
        },
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
    return updatedUser;
});
const updateUserProfileImage = (userId, profileImageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Update user's profile image
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: { profileImage: profileImageUrl },
    });
    const { id, email, profileImage } = updatedUser;
    return { id, email, profileImage };
});
exports.UserService = {
    createUser,
    getAllUsers,
    getUserById,
    deleteUser,
    checkUsernameExists,
    getNewMembers,
    updateUser,
    updateUserProfileImage,
};

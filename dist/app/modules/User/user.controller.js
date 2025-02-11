"use strict";
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
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User information created successfully',
        data: result,
    });
}));
const checkUsername = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'First name and last name are required',
        });
    }
    const userName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const isUsernameTaken = yield user_service_1.UserService.checkUsernameExists(userName);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: isUsernameTaken
            ? 'Username is already taken'
            : 'Username is available',
        data: { userName, isUsernameTaken },
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_service_1.UserService.getUserById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User fetched successfully',
        data: Object.assign(Object.assign({}, user), { password: undefined }),
    });
}));
const getAllUsers = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.UserService.getAllUsers();
    const data = users.map((user) => (Object.assign(Object.assign({}, user), { password: undefined })));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users fetched successfully',
        data,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const loggedId = req.user.id;
    yield user_service_1.UserService.deleteUser(userId, loggedId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'User deleted successfully',
    });
}));
const getNewMembers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newMembers = yield user_service_1.UserService.getNewMembers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New members fetched successfully',
        data: newMembers,
    });
}));
// update user first name and last name
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const data = req.body;
    const result = yield user_service_1.UserService.updateUser(user === null || user === void 0 ? void 0 : user.email, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User information updated successfully',
        data: result,
    });
}));
const updateUserProfileImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    }
    const profileImage = req.file;
    let imageUrl;
    if (profileImage) {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/profile/${profileImage.filename}`;
    }
    if (!imageUrl) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, 'No profile image uploaded');
    }
    const updatedUser = yield user_service_1.UserService.updateUserProfileImage(userId, imageUrl);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile image updated successfully',
        data: updatedUser,
    });
}));
const UserController = {
    createUser,
    getAllUsers,
    deleteUser,
    getUserById,
    checkUsername,
    getNewMembers,
    updateUser,
    updateUserProfileImage,
};
exports.default = UserController;

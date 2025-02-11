"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUploader_1 = require("../../../helpers/fileUploader");
// import { parseBodyData } from '../../middlewares/parseBodyData';
const router = express_1.default.Router();
router.post('/create', 
// validateRequest(userValidation.createUserSchema),
user_controller_1.default.createUser);
// get new members
router.get('/new-members', (0, auth_1.default)(), user_controller_1.default.getNewMembers);
router.put('/update', (0, auth_1.default)(), 
// validateRequest(userValidation.createUserSchema),
user_controller_1.default.updateUser);
// update user profile image
router.patch('/profile-update/:id', (0, auth_1.default)(), fileUploader_1.fileUploader.uploadProfileImage, user_controller_1.default.updateUserProfileImage);
router.get('/', (0, auth_1.default)(), user_controller_1.default.getAllUsers);
router.get('/:id', (0, auth_1.default)(), user_controller_1.default.getUserById);
// update user first name and last name
router.put('/update', (0, auth_1.default)(), 
// validateRequest(userValidation.createUserSchema),
user_controller_1.default.updateUser);
router.delete('/:id', (0, auth_1.default)(client_1.Role.ADMIN), user_controller_1.default.deleteUser);
exports.userRoute = router;

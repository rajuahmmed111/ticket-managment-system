"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = exports.createStorage = exports.fileFilter = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const slugify_1 = __importDefault(require("../utils/slugify"));
// import slugify from "../utils/slugify";
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp',
        'audio/mpeg',
        'video/mp4',
    ];
    if (allowedMimeTypes.includes(file.mimetype) ||
        file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'), false);
    }
};
exports.fileFilter = fileFilter;
// local file storage
const createStorage = (folder) => {
    const uploadFolder = folder
        ? path_1.default.join(process.cwd(), 'uploads', folder)
        : path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(uploadFolder)) {
        fs_1.default.mkdirSync(uploadFolder, { recursive: true });
    }
    return multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadFolder);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = `${(0, uuid_1.v4)()}-${Date.now()}`;
            const fileExtension = path_1.default.extname(file.originalname);
            const slugifiedName = (0, slugify_1.default)(path_1.default.basename(file.originalname, fileExtension));
            const fileName = `${slugifiedName}-${uniqueSuffix}${fileExtension}`;
            cb(null, fileName);
        },
    });
};
exports.createStorage = createStorage;
// Upload messageImages
const uploadMessageImages = (0, multer_1.default)({
    storage: (0, exports.createStorage)('messages'),
    fileFilter: exports.fileFilter,
}).fields([{ name: 'messageImages', maxCount: 10 }]);
// File uploader for profile images
const uploadProfileImage = (0, multer_1.default)({
    storage: (0, exports.createStorage)('profile'),
    fileFilter: exports.fileFilter,
}).single('profileImage');
const upload = (0, multer_1.default)({
    storage: (0, exports.createStorage)(),
    fileFilter: exports.fileFilter,
});
exports.fileUploader = {
    upload,
    uploadProfileImage,
    uploadMessageImages,
};

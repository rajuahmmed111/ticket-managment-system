import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import slugify from '../utils/slugify';
// import slugify from "../utils/slugify";

export const fileFilter = (req: any, file: any, cb: any) => {
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

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    file.mimetype.startsWith('image/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// local file storage
export const createStorage = (folder?: string) => {
  const uploadFolder = folder
    ? path.join(process.cwd(), 'uploads', folder)
    : path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
      const fileExtension = path.extname(file.originalname);

      const slugifiedName = slugify(
        path.basename(file.originalname, fileExtension)
      );

      const fileName = `${slugifiedName}-${uniqueSuffix}${fileExtension}`;

      cb(null, fileName);
    },
  });
};

// Upload messageImages
const uploadMessageImages = multer({
  storage: createStorage('messages'),
  fileFilter: fileFilter,
}).fields([{ name: 'messageImages', maxCount: 10 }]);

// File uploader for profile images
const uploadProfileImage = multer({
  storage: createStorage('profile'),
  fileFilter: fileFilter,
}).single('profileImage');

const upload = multer({
  storage: createStorage(),
  fileFilter: fileFilter,
});

export const fileUploader = {
  upload,
  uploadProfileImage,
  uploadMessageImages,
};

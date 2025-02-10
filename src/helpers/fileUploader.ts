import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join( "/var/www/uploads"));
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// upload single image
const uploadProfilePicture = upload.single('profilePicture');

const uploadBirthdayWishImage = upload.single('birthdayImage');
// upload multiple image
const uploadMultipleMedia = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 },
]);

export const fileUploader = {
  upload,
  uploadMultipleMedia,
  uploadProfilePicture,
  uploadBirthdayWishImage,
};

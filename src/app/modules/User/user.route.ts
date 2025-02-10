import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import UserController from './user.controller';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

import { fileUploader } from '../../../helpars/fileUploaderS3';
// import { parseBodyData } from '../../middlewares/parseBodyData';

const router = express.Router();

router.post(
  '/create',
  validateRequest(userValidation.createUserSchema),
  UserController.createUser
);

// get new members
router.get('/new-members', auth(), UserController.getNewMembers);

router.put(
  '/update',
  auth(),
  // validateRequest(userValidation.createUserSchema),
  UserController.updateUser
);

// update user profile image
router.patch(
  '/profile-img-update/:id',
  auth(),
  fileUploader.uploadProfileImage,
  UserController.updateUserProfileImage
);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

// update user first name and last name
router.put(
  '/update',
  auth(),
  // validateRequest(userValidation.createUserSchema),
  UserController.updateUser
);


router.delete('/:id', auth(Role.ADMIN), UserController.deleteUser);

export const UserRoute = router;

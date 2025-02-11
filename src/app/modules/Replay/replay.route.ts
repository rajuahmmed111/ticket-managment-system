import express from 'express';
import { replayController } from './replay.controller';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';

const router = express.Router();

// replay router
router.post(
  '/replay/:receiverId',
  auth(Role.ADMIN),
  replayController.sendReplay
);

export const replayRoute = router;

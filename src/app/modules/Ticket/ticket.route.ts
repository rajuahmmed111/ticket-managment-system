import express from 'express';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';
import { ticketController } from './ticket.controller';

const router = express.Router();

router.post('/', auth(Role.CUSTOMER), ticketController.createTicket);

export const ticketRoute = router;

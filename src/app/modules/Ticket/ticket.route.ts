import express from 'express';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';
import { ticketController } from './ticket.controller';

const router = express.Router();

// ticket create
router.post('/create', auth(), ticketController.createTicket);

// ticket update
router.post('/update', auth(), ticketController.updateTicket)

export const ticketRoute = router;

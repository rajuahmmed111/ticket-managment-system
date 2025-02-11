import express from 'express';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';
import { ticketController } from './ticket.controller';

const router = express.Router();

// ticket create
router.post('/create', auth(), ticketController.createTicket);

// ticket update
router.put('/update/:id', auth(), ticketController.updateTicket)

// ticket soft delete
// router.patch('/delete/:id', auth(), ticketController.deleteTicket)

export const ticketRoute = router;

import express from 'express';
import auth from '../../middleware/auth';
import { Role } from '@prisma/client';
import { ticketController } from './ticket.controller';

const router = express.Router();

// ticket create
router.post('/create', auth(), ticketController.createTicket);

// ticket update
router.put('/update/:id', auth(), ticketController.updateTicket);

// ticket soft delete
router.patch('/delete/:id', auth(), ticketController.deleteTicket);

// tickets view
router.get('/view', auth(Role.ADMIN), ticketController.viewTickets);

// view single ticket
router.get('/view/:id', auth(), ticketController.viewSingleTicket);

export const ticketRoute = router;

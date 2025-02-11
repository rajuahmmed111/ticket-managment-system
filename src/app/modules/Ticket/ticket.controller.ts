import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ticketService } from './ticket.service';

// create ticket
const createTicket = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const ticketData = req.body;

  const result = await ticketService.createTicket(ticketData, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Ticket created successfully',
    data: result,
  });
});

export const ticketController = {
  createTicket,
};

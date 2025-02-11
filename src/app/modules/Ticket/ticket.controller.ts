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

// update ticket
const updateTicket = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const ticketId = req.params.id;
  const updatedTicketData = req.body;

  const result = await ticketService.updateTicket(
    updatedTicketData,
    ticketId,
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Ticket updated successfully',
    data: result,
  });
});

// ticket soft delete
const deleteTicket = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const ticketId = req.params.id;

  await ticketService.deleteTicket(ticketId, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Ticket soft deleted successfully',
  });
});

// view tickets
const viewTickets = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result = await ticketService.viewTickets(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Tickets fetched successfully',
    data: result,
  });
});

export const ticketController = {
  createTicket,
  updateTicket,
  deleteTicket,
  viewTickets
};

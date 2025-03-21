import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';

// create ticket
const createTicket = async (payload: any, userId: string) => {
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // new ticket
  const newTicket = await prisma.ticket.create({
    data: {
      ...payload,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          UserStatus: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return newTicket;
};

//update ticket
const updateTicket = async (payload: any, ticketId: string, userId: string) => {
  // user validation
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  //ticket validation
  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  if (ticket.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this ticket'
    );
  }

  // update the ticket
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: payload,
  });

  return updatedTicket;
};

// ticket soft delete
const deleteTicket = async (ticketId: string, userId: string) => {
  // user validation
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  if (ticket.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this ticket'
    );
  }

  
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { isDeleted: true },
  });
};

// view tickets
const viewTickets = async (userId: string) => {
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const tickets = await prisma.ticket.findMany({
    where: { userId, isDeleted: false },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });

  return tickets;
};

// view single ticket
const viewSingleTicket = async (ticketId: string, userId: string) => {
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });

  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }

  if (ticket.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to view this ticket'
    );
  }
  return ticket;
};

export const ticketService = {
  createTicket,
  updateTicket,
  deleteTicket,
  viewTickets,
  viewSingleTicket,
};

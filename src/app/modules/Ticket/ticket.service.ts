import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';

const createTicket = async (payload: any, userId: string) => {
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

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

const updateTicket = async (payload: any, ticketId: string, userId: string) => {
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
      'You are not authorized to update this ticket'
    );
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: payload,
  });

  return updatedTicket;
};

export const ticketService = {
  createTicket,
  updateTicket,
};

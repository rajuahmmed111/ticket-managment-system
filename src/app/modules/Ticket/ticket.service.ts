import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';

const createTicket = async (payload: any, userId: string) => {
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const newTicket = await prisma.ticket.create({
    data: payload,
    include: {
      user: true,
    },
    // where: {
    //   id: userId,
    // },
  });

  return newTicket;
};

export const ticketService = {
  createTicket,
};

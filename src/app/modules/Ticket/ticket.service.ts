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

export const ticketService = {
  createTicket,
};

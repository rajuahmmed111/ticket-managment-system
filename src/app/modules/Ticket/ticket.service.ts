import prisma from '../../../shared/prisma';

const createTicket = async (payload: any) => {
  const newTicket = await prisma.ticket.create({
    data: payload,
  });
};

export const ticketService = {
  createTicket,
};

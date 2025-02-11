import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';

const sendReplay = async (
  senderId: string,
  ticketId: string,
  message: string
) => {
  if (!senderId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: { id: true },
      },
    },
  });

  if (!ticket || !ticket.user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Receiver not found');
  }

  const receiverId = ticket.user.id;

  const [person1, person2] = [senderId, receiverId].sort();
  const channelName = person1 + person2;

  const [channel, newMessage] = await prisma.$transaction(
    async (prismaTransaction) => {
      let channel = await prismaTransaction.channel.findFirst({
        where: { channelName: channelName },
      });

      if (!channel) {
        channel = await prismaTransaction.channel.create({
          data: {
            channelName: channelName,
            person1: senderId,
            person2: receiverId,
          },
        });
      }

    }
  );
};

export const replayService = {
  sendReplay,
};

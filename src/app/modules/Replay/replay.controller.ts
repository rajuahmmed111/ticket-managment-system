import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { replayService } from './replay.service';

// send replay in ticket ways user
const sendReplay = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const ticketId = req.params.ticketId;
  const { message } = req.body;

  const result = await replayService.sendReplay(userId, ticketId, message);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Replay sent successfully',
    data: result,
  });
});

export const replayController = {
  sendReplay,
};

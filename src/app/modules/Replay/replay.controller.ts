import catchAsync from '../../../shared/catchAsync';

// send replay in ticket ways user
const sendReplay = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const 
});

export const replayController = {
  sendReplay,
};

const Notification = require('../models/notificationModel');

exports.getAllNotification = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find();

  res.status(200).json({
    status: 'success',
    notifications,
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  await Notification.findByIdAndDelete(req, params.notificationId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

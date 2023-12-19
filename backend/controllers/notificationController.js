const Notification = require('../models/notificationsModel');
const Pharmacist = require('../models/pharmacistModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllNotification = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find();

  res.status(200).json({
    status: 'success',
    notifications,
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findByIdAndDelete(req.params.notificationId);
  if (!notification) {
    return next(new AppError('No notification found with that ID', 404));
  }

  const pharmacistId = notification.pharmacist;
  const pharmacist = await Pharmacist.findById(pharmacistId);
  pharmacist.notifications.pop(notification);
  await pharmacist.save();
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

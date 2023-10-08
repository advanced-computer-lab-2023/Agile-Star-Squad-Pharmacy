const Admin = require('../models/adminModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createAdmin = catchAsync(async (req, res, next) => {
  const newAdmin = await Admin.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      admin: newAdmin,
    },
  });
});

exports.removeAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);

  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find();

  res.status(200).json({
    status: 'success',
    data: {
      admins,
    },
  });
});

exports.getAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      admin,
    },
  });
});


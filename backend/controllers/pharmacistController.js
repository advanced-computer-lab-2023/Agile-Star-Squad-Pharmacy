const Pharmacist = require('../models/pharmacistModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllPharmacist = catchAsync(async (req, res, next) => {
  const Pharmacists = await Pharmacist.find();

  res.status(200).json({
    status: 'success',
    data: {
      Pharmacists,
    },
  });
});

exports.removePharmacist = catchAsync(async (req, res, next) => {
  const Pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);

  if (!Pharmacist) {
    return next(new AppError('No Pharmacist found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const filterObj = (obj, ...allowedFields) => {
  console.log(allowedFields);
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updatePharmacist = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(new AppError('Cannot update password in this route!',400));
  }

  const filteredBody = filterObj(
    req.body,
    'email',
    'hourlyRate',
    'affiliation'
  );
  console.log(filteredBody);
  const updatedPharmacist = await Pharmacist.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  // if (!updatedPharmacist) {
  //   return next(new AppError('Cannot update this field', 400));
  // }
  res.status(200).json({
    status: 'success',
    data: {
      Pharmacist: updatedPharmacist,
    },
  });
});

exports.PharmacistSignup = catchAsync(async (req, res, next) => {
  const newPharmacist = await Pharmacist.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      Pharmacist: newPharmacist,
    },
  });
});


exports.getPharmacist = catchAsync(async (req, res, next) => {
  const Pharmacist = await Pharmacist.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      Pharmacist,
    },
  });
});

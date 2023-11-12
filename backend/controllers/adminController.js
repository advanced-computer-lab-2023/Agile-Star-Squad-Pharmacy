const Admin = require('../models/adminModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Request = require('../models/requestModel');
const Pharmacist = require('../models/pharmacistModel');

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

exports.viewAllRequests = catchAsync(async (req, res, next) => {
  const requests = await Request.find();

  res.status(200).json({
    status: 'success',
    data: {
      requests,
    },
  });
});

async function getPasswordFromDatabase(id) {
  // You need to implement the logic to retrieve the password from your database
  // This might involve making a database query using a database library (e.g., Mongoose for MongoDB)
  console.log(id);
  console.log("henaa");

  // For example, if you are using Mongoose, you might do something like this:
  const user = await Request.findById(id).select("password"); // Replace 'User' with your model name
  // console.log("tab hena?");
  // console.log(user);
  return user

  // if (user) {
  //   return user.password; // Assuming the password is stored in the 'password' field
  // } else {
  //   return "Oops"; // Return null if the user with the given ID is not found
  // }
}

exports.acceptRequest = catchAsync(async (req, res, next) => {
  // console.log("============");
  // console.log(req.body);
  // console.log("============");
  try {
    const user = await getPasswordFromDatabase(req.body.id);
    // console.log(user);
    // console.log("============");
    const data ={
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      hourlyRate: req.body.hourlyRate,
      affiliation: req.body.affiliation,
      educationalBackground: req.body.educationalBackground,
      password: user.password,
    }
    // console.log(data);
    // req.body.password = password;
    const newPharmacist = await Pharmacist.create(data);
    await Request.findByIdAndUpdate(req.body.id, { status: 'Accepted' }, { new: true });
    res.status(200).json({
      status: 'success',
      data: {
        doctor: newPharmacist,
      },
    });
  } catch (error) {
    console.log(error);

    // You can check the type of the error and handle it accordingly.
    if (error.name === 'ValidationError') {
      console.log(error);
      // Handle validation errors (if using a validation library like Joi or Yup).
      // Construct a meaningful error response for the client.
    } else if (error.name === 'MongoError' && error.code === 11000) {
      console.log(error, 'MongoError');
      // Handle duplicate key (unique constraint) errors for MongoDB, if applicable.
      // Construct a meaningful error response for the client.
    } else {
      // Handle other types of errors. You can log the error for debugging purposes
      // and provide a general error response to the client.
      console.error(error);
      // Send an error response to the client with an appropriate status code and message.
    }
  }
});

exports.rejectRequest = catchAsync(async (req, res, next) => {
  await Request.findByIdAndUpdate(req.body.id, { status: 'Rejected' }, { new: true });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});


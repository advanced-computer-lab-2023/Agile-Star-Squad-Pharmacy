const Pharmacist = require('../models/pharmacistModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Request = require('../models/requestModel');
const Patient = require('../models/patientModel');
const ProfessionalChat = require('../models/professionalChatModel');

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
  const pharmacist = await Pharmacist.findByIdAndDelete(req.params.id);

  if (!pharmacist) {
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
    return next(new AppError('Cannot update password in this route!', 400));
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

// exports.pharmacistSignup = catchAsync(async (req, res, next) => {
//   try {
//     const newRequest = await Request.create(req.body);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         request: newRequest,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

exports.pharmacistSignup = catchAsync(async (req, res, next) => {
  try {
    // Check if the username or email already exist in the 'requests' collection
    const existingRequest = await Request.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingRequest) {
      return res.status(400).json({
        status: 'fail',
        message: 'Your request is still pending.',
      });
    }

    // Check if the username or email already exist in the 'pharmacists' collection
    const existingPharmacist = await Pharmacist.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingPharmacist) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already a Pharmacist, try logging in instead.',
      });
    }

    // If neither username nor email exist, create a new request
    const newRequest = await Request.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        request: newRequest,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

exports.getPharmacist = catchAsync(async (req, res, next) => {
  const pharmacist = await Pharmacist.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      pharmacist,
    },
  });
});

exports.getChats = catchAsync(async (req, res, next) => {
  const pharmacist = await Pharmacist.findById(req.params.id);
  const chats = [];
  const patients = await Patient.find();
  for (const patient of patients) {
    if (patient.chat != null) {
      chats.push(patient.chat);
    }
  }

  res.status(200).json({
    status: 'success',
    chats,
    doctorChats: pharmacist.chats
  });
});

exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const pharmacist = await Pharmacist.findById(
    req.params.pharmacistId
  ).populate('notifications');

  res.status(200).json({
    status: 'success',
    data: {
      notifications: pharmacist.notifications,
    },
  });
});

exports.getProfessionalChat = catchAsync(async (req, res, next) => {
  const pharmacist = await Pharmacist.findById(req.params.id);
  console.log(`found pharmacist ${pharmacist.name}`)
  console.log(req.params.doctorId)
  console.log(req.params.doctorId.toString())
  const doctorResult = await fetch(`http://localhost:3000/doctors/${req.params.doctorId.toString()}`);
  const doctorJson = await doctorResult.json();
  // console.log(doctorJson);
  const doctor = doctorJson.data.doctor;
  const chat = await ProfessionalChat.create({pharmacist, doctor});
  const addDoctorResponse = await fetch(`http://localhost:3000/doctors/chats/${req.params.doctorId}/${chat._id.toString()}`);
  console.log(await addDoctorResponse.json())
  await Pharmacist.findByIdAndUpdate(req.params.id, {chats: [...pharmacist.chats, chat._id]})
  res.status(200).json({
    chat
  })
});

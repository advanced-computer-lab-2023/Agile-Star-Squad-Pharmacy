const Chat = require("../models/chatModel");
const Patient = require("../models/patientModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find();

  res.status(200).json({
    status: "success",
    data: {
      patients,
    },
  });
});

exports.removePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return next(new AppError("No patient found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// const createPatient = async (req, res) => {
//   //add a new patient to the database
//   const newPatient = req.body;
//   const addPatient = new patientModel({
//       username: newPatient.username, name: newPatient.name, email: newPatient.patient,
//       password: newPatient.password, dateOfBirth: newPatient.dateOfBirth, gender: newPatient.gender,
//       mobileNumber: newPatient.mobileNumber, emergencyContact: newPatient.emergencyContact});
//   const p = await addPatient.save();
//   res.send(p);
// }

// exports.getAllFamilyMembers = catchAsync(async(req,res,next)=>{
//   const members = await.Family.find()
// })

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const newPatient = await Patient.create(req.body)
    .then((result) => {
      console.log("New patient created:", result);
      return result; // Forward the result for further processing
    })
    .catch((error) => {
      console.error("Error creating patient:", error.message);
      throw error; // Re-throw the error for further handling
    });

  if (newPatient == null) {
    res.status(404).json({
      status: "fail",
      data: {
        error: "error",
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      patient: newPatient,
    },
  });
});
exports.updateWallet = catchAsync(async (req, res, next) => {
  const patientId = req.params.patientId;
  
 
  
  const patient = await Patient.findById(patientId);
   const walletAmount=req.body.walletAmount + patient.wallet;
  if (!patient) {
    return next(new AppError('Patient not found', 404));
  }
  
  
  await Patient.findByIdAndUpdate(patient._id, {
    wallet: walletAmount,
  });

  res.status(200).json({
    status: 'success',
  });
});
exports.getPatient = catchAsync(async (req, res, next) => {
  try {
  const patient = await Patient.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      patient,
    },
  });
  } catch (error) {
  }
});

exports.getCart = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    res.status(200).json({ message: 'Cart gotten successfully', cart: patient.kimoCart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.setCart = async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, {kimoCart: req.body.cart});
    res.status(200).json({ message: 'Cart set successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    let chat = patient.chat;
    if (chat == null) {
      const chatObj = await Chat.create({patient});
      await Patient.findByIdAndUpdate(req.params.id, {chat: chatObj._id});
      chat = chatObj._id;
    } 
    res.status(200).json({ chat: chat});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
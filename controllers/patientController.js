const Patient = require('../models/patientModel');
const catchAsync = require('../utils/catchAsync');
const Family = require('../models/familyModel');

exports.getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find();

  res.status(200).json({
    status: 'success',
    data: {
      patients,
    },
  });
});

exports.removePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return next(new AppError('No patient found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const createPatient = async (req, res) => {
  //add a new patient to the database 
  const newPatient = req.body;
  const addPatient = new patientModel({
      username: newPatient.username, name: newPatient.name, email: newPatient.patient,
      password: newPatient.password, dateOfBirth: newPatient.dateOfBirth, gender: newPatient.gender,
      mobileNumber: newPatient.mobileNumber, emergencyContact: newPatient.emergencyContact});
  const p = await addPatient.save();
  res.send(p);
}


// exports.getAllFamilyMembers = catchAsync(async(req,res,next)=>{
//   const members = await.Family.find()
// })

exports.signup = catchAsync(async (req, res) => {
  const newPatient = await Patient.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      patient: newPatient,
    },
  });
});

exports.getPatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      patient,
    },
  });
});

Modules.exports = {createPatient}
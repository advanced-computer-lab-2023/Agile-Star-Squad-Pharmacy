const mongoose = require('mongoose');
const validator = require('validator');
const Doctor = require('./doctorModel');
const Family = require('../models/familyModel');

const patientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
    maxlength: [30, 'A username must have less or equal then 30 characters'],
    minlength: [8, 'A username must have more or equal to 8 characters'],
  },
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
    validate: [validator.isAlpha, 'Name must only contain letters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
    minLength: 8,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
  },
  mobileNumber: {
    type: Number,
    required: [true, 'Please provide a phone number.'],
  },
  emergencyContact: {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name.'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Please provide an emergency phone number.'],
    },
  },
  doctor: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: [true, 'A patient must belong to a doctor'],
    },
  ],
  familyMembers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Family',
    },
  ],
});
// tourSchema.virtual('familyMembers', {
//   ref: 'Family',
//   foreignField: 'patient',
//   localField: '_id',
// });
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

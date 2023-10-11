const mongoose = require('mongoose');
const validator = require('validator');

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
    contactName:{
    type: String,
      required: [true, 'Please provide the name of your contact.'],
    },
    contactNumber:{
      type: Number,
        required: [true, 'Please provide the phone number of your contact.'],
      },
      contactRelation:{
        type: String,
          required: [true, 'Please provide the relation between you and your contact.']
        }
  },
  
});
// tourSchema.virtual('familyMembers', {
//   ref: 'Family',
//   foreignField: 'patient',
//   localField: '_id',
// });
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

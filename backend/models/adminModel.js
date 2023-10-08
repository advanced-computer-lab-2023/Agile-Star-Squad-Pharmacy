const mongoose = require('mongoose');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    unique: true,
    maxlength: [30, 'A username must have less or equal then 30 characters'],
    // minlength: [8, 'A username must have more or equal to 8 characters'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
    minLength: 8,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

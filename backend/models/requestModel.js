const mongoose = require('mongoose');
const Patient = require('./patientModel');
const validator = require('validator');

const requestSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please provide a username.'],
            unique: true,
            maxlength: [30, 'A username must have 30 characters or less'],
            // minlength: [8, 'A username must have more or equal to 8 characters'],
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
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            select: false,
            minLength: 8,
        },
        dateOfBirth: Date,
        hourlyRate: {
            type: Number,
            required: [true, 'Please provide an hourly rate'],
        },
        affiliation: {
            type: String,
            required: [true, 'Please provide a pharmacy name'],
        },
        educationalBackground: {
            type: String,
            required: [true, 'Please provide an edcational background'],
        },
        status: {
            type: String,
            enum: ['rejected', 'accepted', 'pending'],
            default: 'pending'
        },
        idImage: {
            type: String,
            required: [true, "Please provide your ID."],
        },
        pharmacyLicense: {
            type: String,
            required: [true, "Please provide your medical license."],
        },
        pharmacyDegree: {
            type: String,
            required: [true, "Please provide your medical degree."],
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;

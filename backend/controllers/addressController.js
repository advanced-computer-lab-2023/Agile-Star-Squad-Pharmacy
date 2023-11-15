const Address = require('../models/addressModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addAddress = async (req, res, next) => {
    try {
        const { street, city, country } = req.body;
        const newAddress = await Address.create({
            street,
            city,
            country,
            patient: req.params.patientId
        });
        res.status(200).json({
            status: 'success',
            data: {
                address: newAddress
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.getAllAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.find({ patient: req.params.patientId });
        res.status(200).json({
            status: 'success',
            results: addresses.length,
            data: {
                addresses
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

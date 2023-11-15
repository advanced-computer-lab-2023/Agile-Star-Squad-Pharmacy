const express = require('express');
const addressController = require('../controllers/addressController');

const router = express.Router();

router
    .route('/:patientId')
    .get(addressController.getAllAddresses);
    .post(addressController.addAddress);

//add routes

module.exports = router;


const express = require('express');
const patientController = require('../Controllers/patientController');

const router = express.Router();



router
  .route('/')
  .get(patientController.getAllPatients)
  .post(patientController.signup);

router
  .route('/:id')
  .get(patientController.getPatient)
  .delete(patientController.removePatient);

module.exports = router;

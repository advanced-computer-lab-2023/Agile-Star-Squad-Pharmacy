const express = require('express');
const patientController = require('../Controllers/patientController');
const middleware = require('../middleware/middleware');

const router = express.Router();

router
  .route('/')
  .get(patientController.getAllPatients)
  .post(patientController.signup);

router
  .route('/:id')
  .get(middleware.adminAuth,patientController.getPatient)
  .delete(middleware.adminAuth,patientController.removePatient);

module.exports = router;

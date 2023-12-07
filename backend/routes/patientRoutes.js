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
  .get(middleware.patientAuth, patientController.getPatient)
  .delete(middleware.adminAuth, patientController.removePatient);

router 
  .route('/:id/cart')
  .get(middleware.patientAuth, patientController.getCart)
  .post(middleware.patientAuth, patientController.setCart);

  router
  .route('/:patientId/wallet')
  .post(patientController.updateWallet)
  // .get(
  //   middleware.patientAuth,
  //   appointmentController.upComingAppointmentsForPatients
  // );
module.exports = router;

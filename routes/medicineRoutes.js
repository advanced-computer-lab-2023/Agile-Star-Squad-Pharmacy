const express = require('express');
const medicineController = require('../controllers/medicineController');

const router = express.Router();

router
  .route('/')
  .get(medicineController.getAllMedicines)
  .post(medicineController.createMedicine)

router
  .route('/:id')
  .patch(medicineController.updateMedicine)
  .get(medicineController.getMedicine)

module.exports = router;
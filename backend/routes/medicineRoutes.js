const express = require('express');
const medicineController = require('../controllers/medicineController');
const middleware = require('../middleware/middleware');

const router = express.Router();

router
  .route('/')
  .get(medicineController.getAllMedicines)
  .post(middleware.pharmacistAuth, medicineController.createMedicine);

router
  .route('/:id')
  .patch(middleware.pharmacistAuth, medicineController.updateMedicine)
  .get(middleware.pharmacistAuth, medicineController.getMedicine)
  .delete(middleware.pharmacistAuth);

router
  .route('/archive/:id')
  .patch(middleware.pharmacistAuth, medicineController.archiveMedicine);

router
  .route('/unarchive/:id')
  .patch(middleware.pharmacistAuth, medicineController.unarchiveMedicine);

module.exports = router;
///

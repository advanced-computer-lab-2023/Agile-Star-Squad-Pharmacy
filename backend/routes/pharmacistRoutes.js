const express = require('express');
const pharmacistController = require('../controllers/pharmacistController');

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(pharmacistController.getAllPharmacist)
  .post(pharmacistController.pharmacistSignup);

router
  .route('/:id')
  .get(pharmacistController.getPharmacist)
  .patch(pharmacistController.updatePharmacist)
  .delete(pharmacistController.removePharmacist);

module.exports = router;

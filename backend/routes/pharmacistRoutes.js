const express = require('express');
const pharmacistController = require('../controllers/pharmacistController');
const middleware = require('../middleware/middleware');

const router = express.Router({
  mergeParams: true,
});

router
  .route('/chats')
  .get(pharmacistController.getChats);
  
router
  .route('/')
  .get(pharmacistController.getAllPharmacist)
  .post(pharmacistController.pharmacistSignup);

router
  .route('/:id')
  .get(pharmacistController.getPharmacist)
  .patch(middleware.pharmacistAuth, pharmacistController.updatePharmacist)
  .delete(pharmacistController.removePharmacist);


module.exports = router;

const express = require('express');
const pharmacistController = require('../controllers/pharmacistController');
const notificationController = require('../controllers/notificationController');
const middleware = require('../middleware/middleware');

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(pharmacistController.getAllPharmacist)
  .post(pharmacistController.pharmacistSignup);

router
  .route('/:pharmacistId/notifications/:notificationId')
  .delete(middleware.pharmacistAuth, notificationController.deleteNotification);


router
  .route('/:pharmacistId/notifications')
  .get(middleware.pharmacistAuth, pharmacistController.getMyNotifications);

router
  .route('/:id')
  .get(pharmacistController.getPharmacist)
  .patch(middleware.pharmacistAuth, pharmacistController.updatePharmacist)
  .delete(pharmacistController.removePharmacist);

module.exports = router;

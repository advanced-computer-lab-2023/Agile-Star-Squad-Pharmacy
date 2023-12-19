const express = require('express');
const pharmacistController = require('../controllers/pharmacistController');
const notificationController = require('../controllers/notificationController');
const middleware = require('../middleware/middleware');

const router = express.Router({
  mergeParams: true,
});


router
  .route('/:id/chats')
  .get(pharmacistController.getChats);

router
  .route('/:id/:doctorId/chats')
  .get(pharmacistController.getProfessionalChat);

router
  .route('/')
  .get(middleware.pharmacistAuth, pharmacistController.getAllPharmacist)
  .post(middleware.pharmacistAuth, pharmacistController.pharmacistSignup);

router
  .route('/:pharmacistId/notifications/:notificationId')
  .delete(middleware.pharmacistAuth, notificationController.deleteNotification);


router
  .route('/:pharmacistId/notifications')
  .get(middleware.pharmacistAuth, pharmacistController.getMyNotifications);

router
  .route('/:id')
  .get(middleware.pharmacistAuth, pharmacistController.getPharmacist)
  .patch(middleware.pharmacistAuth, pharmacistController.updatePharmacist)
  .delete(middleware.pharmacistAuth, pharmacistController.removePharmacist);




module.exports = router;

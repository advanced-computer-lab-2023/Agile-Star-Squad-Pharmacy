const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router
  .route('/')
  .get(adminController.getAllAdmins)
  .post(adminController.createAdmin);

router
  .route('/requests')
  .get(adminController.viewAllRequests)
  .post(adminController.acceptRequest)
  .patch(adminController.rejectRequest);

  router
  .route('/orders') 
  .get(adminController.getAllOrders);  


router
  .route('/:id')
  .get(adminController.getAdmin)
  .delete(adminController.removeAdmin);

module.exports = router;

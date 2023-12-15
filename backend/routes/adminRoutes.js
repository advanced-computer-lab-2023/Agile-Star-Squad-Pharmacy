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
  .route('/totalSales:month')  // Add this route
  .get(adminController.getTotalSalesForMonth);

router
  .route('/:id')
  .get(adminController.getAdmin)
  .delete(adminController.removeAdmin);

module.exports = router;

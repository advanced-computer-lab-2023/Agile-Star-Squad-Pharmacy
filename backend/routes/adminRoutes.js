const express = require('express');
const adminController = require('../Controllers/adminController');

const router = express.Router();

router
  .route('/')
  .get(adminController.getAllAdmins)
  .post(adminController.createAdmin);

router
  .route('/requests')
  .get(adminController.viewAllRequests);

router
  .route('/:id')
  .get(adminController.getAdmin)
  .delete(adminController.removeAdmin);

module.exports = router;

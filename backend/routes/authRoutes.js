const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/resetPassword', authController.getOTP);

router
  .post('/resetPassword/:email', authController.forgotPassword)
  .get('/resetPassword/:email', authController.getUserByEmail);

router.patch('/resetPassword/:id', authController.updatePassword);

router.get('/:username/:password', authController.logIn);

module.exports = router;

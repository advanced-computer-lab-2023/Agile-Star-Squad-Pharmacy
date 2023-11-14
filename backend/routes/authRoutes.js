const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/resetPassword', authController.getOTP);

router
  .post('/resetPassword/:email', authController.forgotPassword)
  .get('/resetPassword/:email', authController.getUserByEmail);

router.patch('/resetPassword/:id', authController.updatePassword);

router.get('/:username/:password', authController.logIn);

router.route('/logout').get(authController.logout);

router.route('/me').get(authController.me);

module.exports = router;

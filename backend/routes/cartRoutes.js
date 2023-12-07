const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router
  .get('/', cartController.getCartItems)
  .post('/', cartController.addItemToCart);

router
  .put('/:id', cartController.updateCartItemQuantity)
  .delete('/:id', cartController.deleteCartItem);

module.exports = router;

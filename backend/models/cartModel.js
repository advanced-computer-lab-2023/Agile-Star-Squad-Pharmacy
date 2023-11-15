const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
  },
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;

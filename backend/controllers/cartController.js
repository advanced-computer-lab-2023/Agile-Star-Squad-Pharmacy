const Patient = require('../models/patientModel');
const CartModel = require('../models/cartModel');

// Get all cart items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartModel.find().populate('medicine');
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update cart item quantity
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const updatedCartItem = await CartModel.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.status(200).json(updatedCartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const patient = await Patient.findById(req.body.id).populate('cart');
    const existingCartItem = patient.cart.find(
      (item) => item.medicine.toString() === req.body.medicineId
    );
    if (existingCartItem) {
      existingCartItem.quantity += req.body.quantity;
      await existingCartItem.save();
      res.status(200).json(existingCartItem);
    } else {
      const cartItem = new CartModel({
        quantity: req.body.quantity,
        medicine: req.body.medicineId,
      });
      const newCartItem = await cartItem.save();
      patient.cart.push(newCartItem._id);
      await patient.save();
      res.status(201).json(newCartItem);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete cart item
exports.deleteCartItem = async (req, res) => {
  try {
    const deletedCartItem = await CartModel.findByIdAndDelete(req.params.id);
    await Patient.findByIdAndUpdate(
      req.body.id,
      { $pull: { cart: deletedCartItem._id } },
      { new: true }
    );
    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

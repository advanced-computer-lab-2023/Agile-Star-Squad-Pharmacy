// Import the necessary models
const Order = require('../models/orderModel');
const Patient = require('../models/patientModel');

// Function to get all orders of a patient by their id
const getOrdersByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const orders = await Order.find({ patient: patientId });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get an order by its id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete an order by its id
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const patient = await Patient.findById(order.patient);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    await Order.findByIdAndDelete(id);
    patient.orders.pull(id);
    await patient.save();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to change an order status
const changeOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to add an order
const addOrder = async (req, res) => {
  try {
    const { patientId, medicineList, totalCost } = req.body;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const order = new Order({
      patient: patientId,
      medicineList,
      totalCost,
    });
    await order.save();
    patient.orders.push(order._id);
    await patient.save();
    res.status(201).json({ message: 'Order added successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getOrdersByPatientId,
  getOrderById,
  deleteOrder,
  changeOrderStatus,
  addOrder,
};
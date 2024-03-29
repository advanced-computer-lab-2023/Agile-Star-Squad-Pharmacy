// Import the necessary models
const Order = require('../models/orderModel');
const Patient = require('../models/patientModel');
const Medicine = require('../models/medicineModel');
const Notification = require('../models/notificationsModel');
const Pharmacist = require('../models/pharmacistModel');
const sendEmail = require('../utils/email');

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
    if (!order.isCOD){
      patient.wallet=patient.wallet+order.totalCost;
    }

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
    const { patientId, medicineList, totalCost, address, isCOD } = req.body;
    const pharmacists = await Pharmacist.find();
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const outOfStockMedicines = [];

    for (const medicineObj of medicineList) {
      const medicine = await Medicine.findById(medicineObj.medicineId);
      // maybe add price to revenue and profit to profit
      if (medicine.quantity == medicineObj.count) {
        outOfStockMedicines.push(medicine);
      } else if (medicine.quantity < medicineObj.count) {
        res.status(400).json({ message: `${medicine.name} quantity is larger than stock available` });
        return;
      }
      const newQty = medicine.quantity - medicineObj.count;
      await Medicine.findByIdAndUpdate(medicineObj.medicineId, { quantity: newQty })

    }

    if (outOfStockMedicines.length > 0) {
      let i;
      let phMessage;
      let currentPharmacist;
      for (i = 0; i < outOfStockMedicines.length; i++) {
        phMessage = `${outOfStockMedicines[i].name} is out of stock!`

        pharmacists.map(async(pharmacist) => {
          const newNotification = await Notification.create({ pharmacist: pharmacist, medicineName:outOfStockMedicines[i].name , pharmacistMessage: phMessage });

          pharmacist.notifications.push(newNotification);
          await pharmacist.save();
  
          await pharmacist.save({ validateBeforeSave: false });
          try {
            console.log(pharmacist.email)
            await sendEmail({
              email: pharmacist.email,
              subject: 'You Have New Notification!',
              message: phMessage,
            });
          }
          catch(err){
            console.log(err);
          }
        })
        
      }
    }

    const order = new Order({
      patient: patientId,
      medicineList,
      totalCost,
      address,
      isCOD,
    });

    await order.save();
    patient.orders.push(order._id);
    await patient.save();
    res.status(201).json({ message: 'Order added successfully', outOfStockMedicines, order });
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

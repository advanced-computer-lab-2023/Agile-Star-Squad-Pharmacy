const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  medicineList: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['delivered', 'pending', 'cancelled'],
    default: 'pending',
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

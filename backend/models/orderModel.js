const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  medicineList: [
    {
      medicineId: {
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

// const orderJson = {
//   "medicineList": [
//     {
//       "medicineId": "65216655e6a7687188433def",
//       "count": 2
//     },
//     {
//       "medicineId": "652b04a4b8edbb5c9a41014d",
//       "count": 5
//     }
//   ],
//   "patientId": "6521fc7bb512c918531f7e0b",
//   "totalCost": 100
// };

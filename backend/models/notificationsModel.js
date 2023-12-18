const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  patient:
  {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient'
  },
  pharmacist:
  {
    type: mongoose.Schema.ObjectId,
    ref: 'Pharmacist'
  },
  medicineName:
  {
    type: String,
  },
  patientMessage:
  {
    type: String,
  },
  pharmacistMessage:
  {
    type: String,
  },
  timeStamp: {
    type: Date,
    default: Date.now
  }
});

const Notifications = mongoose.model('Notification', notificationSchema);

module.exports = Notifications;

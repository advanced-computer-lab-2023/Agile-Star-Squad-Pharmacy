const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  pharmacist:
  {
    type: mongoose.Schema.ObjectId,
    ref: 'Pharmacist'
  },
  medicineName:
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

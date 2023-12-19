const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  medicine: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
    },
  ],
  message: {
    type: String,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.export = Notification;

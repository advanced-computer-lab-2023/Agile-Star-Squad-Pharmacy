const mongoose = require('mongoose');
const validator = require('validator');
const chatSchema = new mongoose.Schema({
  patient: {
    type: Object,
    required: [true, 'Missing patient']
  },
  messages: [{
    type: Object
  }],
  lastMessage: {
    type: Object
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

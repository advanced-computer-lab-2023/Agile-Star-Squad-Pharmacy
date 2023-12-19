const mongoose = require('mongoose');
const validator = require('validator');
const professionalsChatSchema = new mongoose.Schema({
  doctor: {
    type: Object,
    required: [true, 'Missing doctor']
  },
  pharmacist: {
    type: Object,
    required: [true, 'Missing pharmacist']
  },
  messages: [{
    type: Object
  }],
  lastMessage: {
    type: Object,
    default: {
      message: "",
      senderId: "",
    }
  }
});

const ProfessionalChat = mongoose.model('ProfessionalChat', professionalsChatSchema);

module.exports = ProfessionalChat;

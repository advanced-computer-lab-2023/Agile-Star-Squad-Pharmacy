const { Decimal128 } = require('bson');
const mongoose = require('mongoose');
const validator = require('validator');
const { float } = require('webidl-conversions');

const medicineSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
    validate: [validator.isAlpha, 'Name must only contain letters'],
  },
  
 
  activeIngredients: {
    type: String,
    required: [true, 'Please provide the ingredients of the medicine.'],
  },
  price: {   
      type: Decimal128,
      required: [true, 'Please provide the price tag.'],
  },
  sales: {   
    type: Number,
    required: [true, 'Please provide the sales.'],
},
  
});
// tourSchema.virtual('familyMembers', {
//   ref: 'Family',
//   foreignField: 'patient',
//   localField: '_id',
// });
const Medicine = mongoose.model('Medicine', medicineSchemaSchema);

module.exports = Medicine;
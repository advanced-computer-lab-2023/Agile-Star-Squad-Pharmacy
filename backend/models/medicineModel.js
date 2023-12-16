const { Decimal128 } = require("bson");
const mongoose = require("mongoose");
const validator = require("validator");
const { float } = require("webidl-conversions");

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name."],
    // validate: [validator.isAlpha, "Name must only contain letters"],
  },

  description: {
    type: String,
    required: [true, "Please provide the ingredients of the medicine."],
  },
  price: {
    type: Number,
    required: [true, "Please provide the price tag."],
  },
  sales: {
    type: Number,
    //required: [true, 'Please provide the sales.'],
  },
  quantity: {
    type: Number,
    required: [true, "Please provide the quantity."],
  },

  image: {
    type: String,
    required: [true, "Please provide the medicine image."],
  },
  medicinalUse: {
    type: String,
    required: [true, "Please provide a list for the medicinal use."],
    minLength: 1,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  activeIngredient: 
    {
      type: "String"
    },
    isOtc: {
      type: Boolean,
      default: false
    }
  
  
});
// tourSchema.virtual('familyMembers', {
//   ref: 'Family',
//   foreignField: 'patient',
//   localField: '_id',
// });
const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;

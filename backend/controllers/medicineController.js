const Medicine = require('../models/medicineModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllMedicines = catchAsync(async (req, res, next) => {
  const medicines = await Medicine.find();

  res.status(200).json({
    status: 'success',
    data: {
      medicines,
    },
  });
});

// exports.removeMedicine = catchAsync(async (req, res, next) => {
//   const medicine = await Medicine.findByIdAndDelete(req.params.id);

//   if (!medicine) {
//     return next(new AppError('No medicine found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.createMedicine = async (req, res) => {
  //add a new Medicine to the database
  console.log | 'henaa';
  const newMedicine = req.body;
  const addMedicine = new Medicine({
    name: newMedicine.name,
    description: newMedicine.description,
    price: newMedicine.price,
    sales: newMedicine.sales,
    quantity: newMedicine.quantity,
    medicinalUse: newMedicine.medicinalUse,
    image: newMedicine.image,
  });
  const p = await addMedicine.save();
  res.send(p);
};

exports.getMedicine = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findById(req.params.id, { archived: false });
  const sales = medicine.sales;
  const quantity = medicine.quantity;

  if (medicine.archived === true) {
    res.status(404).json({ message: 'Medicine not found or archived' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      sales,
      quantity,
    },
  });
});
// exports.getMedicine = catchAsync(async (req, res, next) => {
//   const medicine = await Medicine.findById(req.params.id);
//   const selectFields = 'quantity';

//   res.status(200).json({
//     status: 'success',
//     data: {
//         medicine.quantity,
//         medicine.sales,
//     },
//   });
// });
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMedicine = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'name',
    'activeIngredients',
    'price',
    'sales',
    'quantity',
    'image'
  );

  let filteredBodyFinal = {};
  Object.keys(filteredBody).forEach((key) => {
    if (filteredBody[key] !== '') {
      filteredBodyFinal[key] = filteredBody[key];
    }
  });

  // Update the medicine with the filtered body
  const updatedMedicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    filteredBodyFinal,
    {
      new: true,
      runValidators: true,
    }
  );
  // Respond with the updated medicine
  res.status(200).json({
    status: 'success',
    data: {
      medicine: updatedMedicine,
    },
  });
});

exports.archiveMedicine = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    { archived: true },
    { new: true }
  );
  if (!medicine) {
    return res.status(404).json({ message: 'Medicine not found' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      medicine,
    },
  });
});

exports.unarchiveMedicine = catchAsync(async (req, res, next) => {
  const medicine = await Medicine.findByIdAndUpdate(
    req.params.id,
    { archived: false },
    { new: true }
  );
  if (!medicine) {
    return res.status(404).json({ message: 'Medicine not found' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      medicine,
    },
  });
});

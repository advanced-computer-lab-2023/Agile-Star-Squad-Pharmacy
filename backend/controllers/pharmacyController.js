const Medicines = require("../models/medicineModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllMedicines = catchAsync(async (req, res, next) => {
  let Medicine = await Medicines.find();
  res.status(200).json({
    status: "success",
    data: {
      Medicine,
    },
  });
});

exports.getAllMedicines = getAllMedicines;

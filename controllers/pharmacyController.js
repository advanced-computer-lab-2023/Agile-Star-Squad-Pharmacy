const Medicines = require("../models/medicineModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllMedicines = catchAsync(async (req, res, next) => {
  let Medicine = await Medicines.find().select("image price description");
  res.status(200).json({
    status: "success",
    data: {
      Medicine,
    },
  });
});

const searchByName = catchAsync(async (req, res, next) => {
  const Medicine = await Medicines.find();

  const { name } = req.body;

  const searchResult = Medicine.filter((m) => m.name.includes(name));

  if (searchResult.length === 0) {
    return next(new AppError("fail, Medicine not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      Medicine: searchResult,
    },
  });
});

const filterByMedicinalUse = catchAsync(async (req, res, next) => {
  const Medicine = await Medicines.find();

  const { medicinalUse } = req.body;

  const match = Medicine.filter((dbMedicine) =>
    dbMedicine.medicinalUse.find((dbUse) =>
      medicinalUse.find((use) => use === dbUse)
    )
  );

  const exactMatch = match.filter((dbMedicine) => {
    let isMatch = true;
    for (const use of medicinalUse) {
      if (!dbMedicine.medicinalUse.includes(use)) {
        isMatch = false;
        break;
      }
    }

    return isMatch;
  });

  const partialMatch = match.filter((p) => !exactMatch.includes(p));

  if (partialMatch.length === 0 && exactMatch.length === 0) {
    return next(new AppError("fail, Medicine not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      partialMatch,
      exactMatch,
    },
  });
});

exports.getAllMedicines = getAllMedicines;
exports.searchByName = searchByName;
exports.filterByMedicinalUse = filterByMedicinalUse;

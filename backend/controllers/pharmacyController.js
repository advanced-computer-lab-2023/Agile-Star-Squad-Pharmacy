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

const searchByName = catchAsync(async (req, res, next) => {
  const Medicine = await Medicines.find();

  const { name } = req.body;

  if (!name && name !== "") {
    return next(new AppError("fail, expecting medicine name in req.body", 404));
  }

  const searchResult = Medicine.filter((m) => m.name.includes(name));

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

  if (!medicinalUse) {
    return next(
      new AppError("fail, expecting medicine medicinalUse in req.body", 404)
    );
  }

  if (medicinalUse.length === 0) {
    return res.status(200).json({
      status: "success",
      data: {
        partialMatch: [],
        exactMatch: Medicine,
      },
    });
  }

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

const express = require("express");

const pharmacyController = require("../controllers/pharmacyController");

const router = express.Router();

router.get("/", pharmacyController.getAllMedicines);

module.exports = router;

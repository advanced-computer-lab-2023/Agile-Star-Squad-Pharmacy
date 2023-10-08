const express = require("express");

const pharmacyController = require("../controllers/pharmacyController");

const router = express.Router();

router.get("/", pharmacyController.getAllMedicines);

router.get("/search", pharmacyController.searchByName);

router.get("/filter", pharmacyController.filterByMedicinalUse);

module.exports = router;

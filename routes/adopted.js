const express = require('express');
const router = express.Router();

const adoptedController = require("../controllers/adoptedController");
router.post("/adopted-pets", adoptedController.displayAdopted);
router.get("/adopted-list", adoptedController.displayAdoptedList)

module.exports = router;
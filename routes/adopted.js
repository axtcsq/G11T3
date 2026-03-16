const express = require('express');
const router = express.Router();

const adoptedController = require("../controllers/adoptedController");
router.get("/adopted-pets", adoptedController.displayAdopted);

module.exports = router;
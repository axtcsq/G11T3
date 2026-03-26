const express = require('express');
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const adoptedController = require("../controllers/adoptedController");

router.get("/adopted-list", requireAdmin, adoptedController.displayAdoptedList)
router.post("/adopted-pets", adoptedController.displayAdopted);

router.get('/edit-adopted', requireAdmin, adoptedController.showEdit)
router.get("/update-adopted", requireAdmin, adoptedController.getAdopted);
router.post("/update-adopted", requireAdmin, adoptedController.updateAdopted);

module.exports = router;
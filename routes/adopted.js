const express = require('express');
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const adoptedController = require("../controllers/adoptedController");

// EVERYTHING BELOW = ADMIN ONLY
router.use(requireAdmin);

router.post("/adopted-pets", requireAdmin, adoptedController.displayAdopted);
router.get("/adopted-list", requireAdmin, adoptedController.displayAdoptedList)

router.get('/edit-adopted', requireAdmin, adoptedController.showEdit)
router.get("/update-adopted", requireAdmin, adoptedController.getAdopted);
router.post("/update-adopted", requireAdmin, adoptedController.updateAdopted);

module.exports = router;
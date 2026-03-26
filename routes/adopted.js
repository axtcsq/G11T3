const express = require('express');
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const adoptedController = require("../controllers/adoptedController");

// EVERYTHING BELOW = ADMIN ONLY
router.use(requireAdmin);

router.post("/adopted-pets", adoptedController.displayAdopted);
router.get("/adopted-list", adoptedController.displayAdoptedList)

router.get('/edit-adopted', adoptedController.showEdit)
router.get("/update-adopted", adoptedController.getAdopted);
router.post("/update-adopted", adoptedController.updateAdopted);

module.exports = router;
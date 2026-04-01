const express = require('express');
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const { requireLogin } = require("../middleware/auth");
const adoptedController = require("../controllers/adoptedController");

router.get("/adopted-list", requireAdmin, adoptedController.displayAdoptedList)
router.post("/adopted-pets", requireLogin, adoptedController.displayAdopted);

router.get('/edit-adopted', requireAdmin, adoptedController.showEdit)
router.get("/update-adopted", requireAdmin, adoptedController.getAdopted);
router.post("/update-adopted", requireAdmin, adoptedController.updateAdopted);
router.get('/del-adopted', requireAdmin, adoptedController.showDelForm)
router.post('/del-adopted', requireAdmin, adoptedController.delAdopted)


module.exports = router;
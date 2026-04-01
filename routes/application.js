const express = require('express');
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const { requireLogin } = require("../middleware/auth");
const applicationController = require("../controllers/applicationController");

router.get("/application-list", requireAdmin, applicationController.displayapplicationList)
router.post("/application-pets", requireLogin, applicationController.displayapplication);

router.get('/edit-application', requireAdmin, applicationController.showEdit)
router.get("/update-application", requireAdmin, applicationController.getapplication);
router.post("/update-application", requireAdmin, applicationController.updateapplication);
router.get('/del-application', requireAdmin, applicationController.showDelForm)
router.post('/del-application', requireAdmin, applicationController.delapplication)


module.exports = router;
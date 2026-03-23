const express = require('express');
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");

router.get('/my-visits', appointmentController.getMyAppointments);
router.post('/book', appointmentController.createAppointment);
router.post('/update/:id', appointmentController.updateAppointment);
router.post('/delete/:id', appointmentController.deleteAppointment);

module.exports = router;
const express = require('express');
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post('/book', appointmentController.bookAppointment);

router.get('/view-appointment', appointmentController.viewAppointments);

module.exports = router;
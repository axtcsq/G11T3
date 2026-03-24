const express = require('express');
const router = express.Router();

const appointmentController = require("../controllers/appointmentController");

router.post('/book', appointmentController.bookAppointment);
// This will handle the redirect from line 32 of your controller
// It maps to /appointment/appointments because of your server.js prefix
router.get('/appointments', appointmentController.viewAppointments);

module.exports = router;
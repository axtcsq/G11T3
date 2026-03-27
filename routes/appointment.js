const express = require('express');
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// The routes tell the router which "brain" (controller) to wake up to handle each specific request.

router.post('/book', appointmentController.bookAppointment);

router.get('/view-appointment', appointmentController.viewAppointments);

// The :id is a placeholder. It tells the server: "If someone visits a URL that starts with /delete/, take whatever characters come next and call them id."
router.get('/delete-appointment/:id', appointmentController.deleteAppointment);

module.exports = router;
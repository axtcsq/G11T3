const express = require('express');
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// The routes tell the router which "brain" (controller) to wake up to handle each specific request.

// route for CREATE
router.post('/book', appointmentController.bookAppointment);

// route for READ
router.get('/view-appointment', appointmentController.viewAppointments);

// routes for UPDATE 
// GET shows the form
router.get('/edit-appointment/:id', appointmentController.editAppointmentPage);
// POST saves the data
router.post('/update-appointment/:id', appointmentController.updateAppointment);

// route for DELETE 
// The :id is a placeholder. It tells the server: "If someone visits a URL that starts with /delete/, take whatever characters come next and call them id."
router.get('/delete-appointment/:id', appointmentController.deleteAppointment);


module.exports = router;
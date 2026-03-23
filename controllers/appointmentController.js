const appointment = require('./../models/appointmentModel');
const Pet = require('./../models/petsModel');

// READ: Display "My Visits"
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userName: req.body.userName }); // Logic to filter by current user
        res.render('appointment-list', { appointments });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// CREATE: Show the form and save the data
exports.createAppointment = async (req, res) => {
    try {
        await Appointment.create(req.body);
        res.redirect('/appointments/my-visits');
    } catch (err) {
        res.status(400).send("Error creating appointment");
    }
};

// UPDATE: Reschedule
exports.updateAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { date: req.body.newDate });
        res.redirect('/appointments/my-visits');
    } catch (err) {
        res.status(400).send("Update failed");
    }
};

// DELETE: Cancel visit
exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.redirect('/appointments/my-visits');
    } catch (err) {
        res.status(400).send("Cancellation failed");
    }
};
const appointment = require('./../models/appointmentModel');
const Pet = require('./../models/petsModel');

// controller/appointmentController.js (or similar)

// controllers/appointmentController.js

exports.bookAppointment = async (req, res) => {
    console.log('I am in the controller');
    try {
        const petId = req.body.petId
        const appointmentDate = req.body.appointmentDate
        const timeSlot = req.body.timeSlot
        const userName = req.body.userName 
        
        
        // 2. This now matches the variable name 'appointmentModel' above
        const existing = await appointment.findById(petId);

        // 3. Conflict Check
        if (existing && existing.date === appointmentDate && existing.time === timeSlot) {
            return res.status(400).send("This pet is already booked for this time!");
        }

        // 4. Using the exported function from your model
        await appointment.addAppointment({
            petId: petId,
            date: appointmentDate,
            time: timeSlot,
            userName: userName
        });

        res.redirect('/view-appointment'); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving appointment");
    }
};

exports.viewAppointments = async (req, res) => {
    try {
    
        const allAppointments = await appointment.retrieveAll();

        res.render('view-appointment', {
            appointments: allAppointments,
            isAdmin: false
        });
        // This renders the EJS file and passes the data to it
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not load appointments.");
    }
};
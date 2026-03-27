const appointment = require('./../models/appointmentModel');
const Pet = require('./../models/petsModel');

// TO BE FIXED
// 1. Edit/update schedule function
// 2. Display petID (short) instead of 16 digit ID (fixed)
// 3. Display petname instead of unknown pet (fixed)
// 4. Create session to allow each user to only view thier OWN scheduled appointments
// 5. Improve design of "This slot has already been boooked" page and see how it actually is functioning
// 6. admin should be able to see all appointments (and username of person ?)

// Creates appointment 
exports.bookAppointment = async (req, res) => {
    try {
        const petId = req.body.petId;
        const appointmentDate = req.body.appointmentDate;
        const timeSlot = req.body.timeSlot;
        const userName = req.body.userName

        // 1. Fetch the actual Pet details using the petId from the form
        // We look in the Pet collection to find the name (e.g., "Ronaldo")
        const actualPet = await Pet.findByID(petId); 
       
        // 2. Check if the pet exists; if not, provide a fallback name
        const petName = actualPet ? actualPet.name : "Unknown Pet"; // !!! not sure what this does , why pet is unknown pet ?

        // IMPROVED CONFLICT CHECK 
        const existing = await appointment.checkConflict(petId, appointmentDate, timeSlot);
        if (existing) {
        // Instead of res.send, we go back to the page with a message
        return res.render('error-appointment', { 
            message: "Sorry! This pet already has an appointment for that date and time slot." 
        });
        };

        // 4. Save the appointment with the REAL pet name we just found
        await appointment.addAppointment({
            petId: petId,
            date: appointmentDate,
            time: timeSlot,
            userName: userName,
            name: petName // This is no longer an empty string!
        });

        res.render('successful-appointment');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving appointment");
    }
};

// Render View appointment
exports.viewAppointments = async (req, res) => {
    try {
        const allAppointments = await appointment.retrieveAll();

        // This renders the EJS file and passes the data to it
        res.render('view-appointment', {
            appointments: allAppointments
        });
       
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not load appointments.");
    }
};

// DELETE 
exports.deleteAppointment = async (req, res) => {
    try {
        const id = req.params.id; // We get the ID from the URL
        await appointment.deleteAppointment(id);
        res.redirect('/view-appointment');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting appointment");
    }
};

// Show the Edit Page
exports.editAppointmentPage = async (req, res) => {
    try {
        const id = req.params.id;
        const appt = await appointment.findAppointmentById(id);
        res.render('edit-appointment', { appointment: appt });
    } catch (err) {
        res.status(500).send("Error loading edit page");
    }
};

// Handle the Update
exports.updateAppointment = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = {
            date: req.body.appointmentDate, // Matches form 'name'
            time: req.body.timeSlot        // Matches form 'name'
        };
        
        await appointment.updateAppointment(id, updatedData);
        res.render('successful-appointment'); 
    } catch (err) {
        res.render('error-appointment', { message: "Something went wrong while rescheduling." });
    }
};
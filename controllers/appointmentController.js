const appointment = require('./../models/appointmentModel');
const Pet = require('./../models/petsModel');

// controller/appointmentController.js (or similar)

// controllers/appointmentController.js

exports.bookAppointment = async (req, res) => {
    console.log('I am in the controller');
    try {
        const petId = req.body.petId;
        const appointmentDate = req.body.appointmentDate;
        const timeSlot = req.body.timeSlot;
        const userName = req.body.userName

        // 1. Fetch the actual Pet details using the petId from the form
        // We look in the Pet collection to find the name (e.g., "Ronaldo")
        const actualPet = await Pet.findByID(petId); 
         // trying to get pet name as well but still got issues
        // 2. Check if the pet exists; if not, provide a fallback name
        const petName = actualPet ? actualPet.name : "Unknown Pet"; // !!! not sure what this does , why pet is unknown pet ?

        // 3. Conflict Check (Existing logic)
        const existing = await appointment.findById(petId);
        if (existing && existing.date === appointmentDate && existing.time === timeSlot) {
            return res.status(400).send("This pet is already booked for this time!");
        }

        // 4. Save the appointment with the REAL pet name we just found
        await appointment.addAppointment({
            petId: petId,
            date: appointmentDate,
            time: timeSlot,
            userName: userName,
            name: petName // This is no longer an empty string!
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
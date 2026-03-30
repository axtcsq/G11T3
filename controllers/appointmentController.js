const appointment = require('./../models/appointmentModel');
const adopted = require('./../models/adoptedModel');
const Pet = require('./../models/petsModel');
const mongoose = require('mongoose'); // Add this at the very top of your controller

// TO BE FIXED
// 1. Edit/update schedule function
// 2. Display petID (short) instead of 16 digit ID (fixed)
// 3. Display petname instead of unknown pet (fixed)
// 4. Create session to allow each user to only view thier OWN scheduled appointments
// 5. Improve design of "This slot has already been boooked" page and see how it actually is functioning
// 6. admin should be able to see all appointments (and username of person ?)

// CREATE 
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
        await adopted.addAdopted({ 
            userName: req.session.user.username,
            petId: petId,
          })
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

// READ - view appointments based on user session
// it now checks for the user logged in and filters for the appointments belonging to that user only by implementing sessions
exports.viewAppointments = async (req, res) => {
    try {
        // 1. Get the user from the session
        const currentUser = req.session.user;

        // 2. Safety check: Redirect if no session exists
        if (!currentUser) {
            return res.redirect('/login');
        }

        // 3. Define the filter
        // If the user is an 'admin', we use an empty filter {} to see everything.
        // Otherwise, we filter by the specific userName.
        let filter = { userName: currentUser.username }; // currentUser = { username: 'yw', type: 'user' } when the filter expects a string
                                                // hence we do {usernAME : CURRENTuser.username} to access the username = 'yw'
        
        if (req.session.user.type === 'admin') { // checks usertype to see if admin OR user
            filter = {};                         // if admin, then remove filter 
        }
        console.log(req.session.user.type)

        // 4. Fetch from database using the filter
        const allAppointments = await appointment.retrieveAll(filter);

        // 5. Render the page with the filtered data
        res.render('view-appointment', {
            appointments: allAppointments,
            user: currentUser
        });

    } catch (err) {
        console.error("Error loading appointments:", err);
        res.status(500).send("Could not load appointments.");
    }
};


// UPDATE 

// 1. Show the Edit Page
exports.editAppointmentPage = async (req, res) => {
    try {
        const id = req.params.id;
        const appt = await appointment.findAppointmentById(id);
        if (!appt) return res.status(404).send("Appointment not found");
        
        res.render('edit-appointment', { appointment: appt });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit page");
    }
};

// 2. Process the Update
exports.updateAppointment = async (req, res) => {
    try {
        const id = req.params.id;
        const newDate = req.body.appointmentDate;
        const newTime = req.body.timeSlot;

        // 1. Convert the ID string to a MongoDB ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Fetch the existing appointment to get the petId
        const currentAppt = await appointment.findAppointmentById(id);
        if (!currentAppt) return res.status(404).send("Appointment not found");

        // 2. Fix the typo in the conflict check (Line 103)
        const conflict = await appointment.findOne({
            _id: { $ne: objectId },
            petId: currentAppt.petId, // Use capital 'I' as defined in your schema
            date: newDate,
            time: newTime
        });

        if (conflict) {
            // This will only trigger now if a DIFFERENT appointment exists there
            return res.render('error-appointment', { 
                message: "Sorry! That time slot is already taken by another booking." 
            });
        }

        // 3. If no conflict, save the changes
        const updatedData = { date: newDate, time: newTime };
        await appointment.updateToAppointment(id, updatedData);
        
        res.render('successful-appointment'); 

    } catch (err) {
        console.error("Reschedule Error:", err);
        res.render('error-appointment', { message: "Error during rescheduling." });
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



const appointment = require('./../models/appointmentModel');
const application = require('./../models/applicationModel');
const Pet = require('./../models/petsModel');
const mongoose = require('mongoose'); // Add this at the very top of your controller

const getExistingAppointments = async () => {
    return await appointment.retrieveAll({}); 
};

// CREATE 
exports.bookAppointment = async (req, res) => { // if have await feature must have async to tell javascript the code is asynchronous
    try {

        // null check 
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const petId = req.body.petId;
        const userName = req.session.user.username;
        
        // Split the combined value "YYYY-MM-DD|10:00 AM..."
        const [appointmentDate, timeSlot] = req.body.appointmentDateTime.split('|');

        // 1. Fetch actual Pet details
        const actualPet = await Pet.findByID(petId); 
        const petName = actualPet ? actualPet.name : "Unknown Pet";

        // 2. Multi-Rule Conflict Check
            const existing = await appointment.findOne({
                $and: [
                    { date: appointmentDate },
                    { time: timeSlot },
                    { $or: [ { petId: petId }, { userName: userName } ] }
                ]
            });

            if (existing) {
                const msg = existing.petId === petId 
                    ? "This pet is already booked for that time." 
                    : "You already have another appointment at this time.";
                return res.render('error-appointment', { message: msg });
            }

        // 3 Limiter : sets a limit of 3 appointments per user at one time --> prevents any user from spam booking all available appointments 
            const userAppointmentCount = await appointment.countAppointments({ userName });
            if (userAppointmentCount >= 3) {
                return res.render('appointment-limit', { 
                    message: "You have reached the maximum of 3 appointments. Please cancel an existing one before booking again." 
                });
            }
        // 4. Save Appointment
        await application.addapplication({ userName, petId });
        await appointment.addAppointment({
            petId,
            date: appointmentDate,
            time: timeSlot,
            userName,
            name: petName 
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
// Look for the function that RENDERS the edit page
exports.editAppointmentPage = async (req, res) => {
    try {
        const id = req.params.id;
        const appt = await appointment.findAppointmentById(id);
        
        // must define isAdmin and pass it to the render function
        const isAdmin = req.session.user && req.session.user.type === 'admin';

        // FETCH ALL BOOKED SLOTS
        const bookedSlots = await getExistingAppointments();
        
        res.render('edit-appointment', { 
            appointment: appt,
            isAdmin: isAdmin,
            user: req.session.user,
            bookedSlots: bookedSlots // Pass this to the view
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit page");
    }
};

// 2. Process the Update
// UPDATE / RESCHEDULE
exports.updateAppointment = async (req, res) => {
    try {
        const id = req.params.id;
        
        // 1. Safety Check: Ensure the form actually sent the data
        if (!req.body.appointmentDateTime) {
            return res.status(400).send("No date or time selected. Please go back and select a slot.");
        }

        // 2. Split the combined value "YYYY-MM-DD|10:00 AM..."
        const [newDate, newTime] = req.body.appointmentDateTime.split('|');
        const objectId = new mongoose.Types.ObjectId(id);

        // 3. Fetch existing appointment to get the petId
        const currentAppt = await appointment.findAppointmentById(id);
        if (!currentAppt) return res.status(404).send("Appointment not found");

        // ensures only the owner or an admin can edit
        if (req.session.user.type !== 'admin' && currentAppt.userName !== req.session.user.username) {
            return res.status(403).send("You are not allowed to edit this appointment");
        }

        // 4. Conflict Check
        // We look for a conflict with the SAME pet at the SAME time
        // BUT we exclude the current appointment (_id: { $ne: objectId }) so still can resave current slot 
        const conflict = await appointment.findOne({
            _id: { $ne: objectId }, 
            petId: currentAppt.petId,
            date: newDate,
            time: newTime
        });

        if (conflict) {
            return res.render('error-appointment', { 
                message: "Sorry! That time slot is already taken for this pet." 
            });
        }

        // 5. Save the changes
        await appointment.updateToAppointment(id, { date: newDate, time: newTime });
        
        res.render('successful-appointment'); 

    } catch (err) {
        console.error("Update Error:", err);
        res.render('error-appointment', { message: "Error during update." });
    }
};

// DELETE 
exports.deleteAppointment = async (req, res) => {
    try {
        const id = req.params.id; // We get the ID from the URL

        // ensures only the owner or an admin can edit
        if (req.session.user.type !== 'admin' && appt.userName !== req.session.user.username) {
            return res.status(403).send("You are not allowed to delete this appointment");
        }

        await appointment.deleteAppointment(id);
        res.redirect('/view-appointment');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting appointment");
    }
};



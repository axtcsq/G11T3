const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({ 
    userName: {
    type: String,
    required: [true, "User must exist"],
  },
    petId: {
    type: String,
    required: [true, "Pet id must exist"],
  },
    name: {
    type: String,
    required: [true, "A pet must have a name"], 
  },
    date: { 
    type: String,  
    required: [true, "You must select a date"],
    },

    time: {
    type: String,
    required: [true , "You must select a timeslot"]
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema, "appointments");

// CREATE APPOINTMENT 
exports.addAppointment = function(newAppointment) {
    return Appointment.create(newAppointment);
};

exports.checkConflict = function(petId, date, time) {
    return Appointment.findOne({ petId, date, time });
};

// counts num of appointments that current user has 
exports.countAppointments = async (filter) => {
    return await Appointment.countDocuments(filter);
};

// READ APPOINTMENT (VIEW)
exports.retrieveAll = async (filter = {}) => {
    // sort by date first then by time for appointments on the same day 
    return await Appointment.find(filter).sort({date:1 , time:1}); 
};

// UPDATE FUNCTION (EDIT)
exports.findAppointmentById = function(id) {
    return Appointment.findById(id);
};

// The Update Function
exports.updateToAppointment = function(id, updateData) {
    // We use $set to only change the date and time
    return Appointment.updateOne({ _id: id }, { $set: updateData });
};

// for the conflict catcher to work
exports.findOne = function(query) {
    return Appointment.findOne(query);
};

// DELETE FUNCTION
exports.deleteAppointment = function(id) {
    return Appointment.findByIdAndDelete(id);
};
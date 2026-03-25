const mongoose = require("mongoose");

// Create a new appointment schema
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
    required: [true, "A pet must have a name"], // added pet name 
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

exports.retrieveAll = function() {
    // This filters the database for only this user's appointments
    return Appointment.find(); 
};

exports.addAppointment = function(newAppointment) {
    return Appointment.create(newAppointment);
};

exports.findById = function(id) {
    return Appointment.findOne({ petId:id });
};

exports.editAppointment = function(id, name) {
    return Appointment.updateOne({petId:id}, {userName:name});
};


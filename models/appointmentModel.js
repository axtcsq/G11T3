const mongoose = require("mongoose");

// Create a new appointment schema
const appointmentSchema = new mongoose.Schema({
 userName: { type: String, required: [true, "User must exist"] },
    petId: { type: String, required: [true, "Pet id must exist"] },
    date: { type: Date, required: true },
    status: { type: String, default: "Scheduled" } // Scheduled, Completed, Cancelled
});

module.exports = mongoose.model("Appointment", appointmentSchema);

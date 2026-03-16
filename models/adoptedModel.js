const mongoose = require("mongoose");

// Create a new adopted schema
const adoptedSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User must exist"],
  },
  petName: {
    type: String,
    required: [true, "Pet name must exist"],
  },
  
});

const adopted = mongoose.model("Adopted", adoptedSchema, "adopted");

exports.retrieveAll = function() {
  return adopted.find();
};

exports.addAdopted = function(newAdopted) {
    return adopted.create(newAdopted);
};
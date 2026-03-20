const mongoose = require("mongoose");

// Create a new adopted schema
const adoptedSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User must exist"],
  },
  petId: {
    type: String,
    required: [true, "Pet id must exist"],
  },
  
});

const adopted = mongoose.model("pet", adoptedSchema, "adopted");

exports.retrieveAll = function() {
  return adopted.find();
};

exports.addAdopted = function(newAdopted) {
    return adopted.create(newAdopted);
};

exports.findByID = function(id) {
    return adopted.findOne({ petId:id });
};

exports.editAdopted = function(id, name) {
    return adopted.updateOne({petId:id}, {userName:name});
};


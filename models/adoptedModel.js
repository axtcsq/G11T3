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
  adoptedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "rejected"],
    default: "Pending"
  }

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

exports.editAdopted = function(id, name, status) {
    return adopted.updateOne({petId:id}, {userName:name, status: status});
};

exports.delAdopted = function(id) {
  return adopted.deleteOne({_id: id})
}

